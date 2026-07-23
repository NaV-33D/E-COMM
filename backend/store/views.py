from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Case, Count, IntegerField, Q, Sum, Value, When
from django.db.models.functions import TruncDate
from django.conf import settings
from django.utils import timezone
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from datetime import timedelta
from rest_framework.pagination import PageNumberPagination
from .serializers import RegisterSerializer, UserSerializer, ProfileSerializer, ReviewSerializer
from rest_framework import status
from .models import Product, Category, Cart, CartItem, Order, OrderItem, WishlistItem, Wishlist, Profile, Review
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer, WishlistItemSerializer, WishlistSerializer

@api_view(['GET'])
def get_products(request):
    products = Product.objects.prefetch_related('reviews')

    search = request.GET.get("search")
    category = request.GET.get("category")

    if search:
        products = products.filter(
            Q(name__icontains=search) | Q(description__icontains=search)
        ).annotate(
            search_rank=Case(
                When(name__icontains=search, then=Value(0)),
                default=Value(1),
                output_field=IntegerField(),
            )
        ).order_by('search_rank', 'name')

    if category:
        products = products.filter(category_id=category)

    paginator = PageNumberPagination()
    paginator.page_size = settings.REST_FRAMEWORK['PAGE_SIZE']
    page = paginator.paginate_queryset(products, request)
    serializer = ProductSerializer(page, many=True)
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.prefetch_related('reviews').get(id=pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    if product.stock_quantity < 1:
        return Response({'error': 'Product is out of stock'}, status=status.HTTP_400_BAD_REQUEST)
    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={'quantity': 1})
    if not created:
        if item.quantity >= product.stock_quantity:
            return Response({'error': f'Only {product.stock_quantity} available'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity += 1
        item.save()
    return Response({'message': 'Product added to cart',"cart":CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')
   
    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)
    
    try:
        item = CartItem.objects.get(id=item_id, cart__user=request.user)
        if int(quantity) < 1:
            item.delete()
            return Response({'error': 'Quantity must be at least 1'}, status=400)
        
        quantity = int(quantity)
        if quantity > item.product.stock_quantity:
            return Response({'error': f'Only {item.product.stock_quantity} available'}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id, cart__user=request.user).delete()
    return Response({'message': 'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method','COD')

        #validate Phone Number
        if not phone or not phone.isdigit() or len(phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)
        with transaction.atomic():
            cart, created = Cart.objects.get_or_create(user=request.user)
            items = list(cart.items.select_related('product'))
            if not items:
                return Response({'error': 'Cart is empty'}, status=400)

            locked_products = {
                product.id: product
                for product in Product.objects.select_for_update().filter(
                    id__in=[item.product_id for item in items]
                )
            }
            for item in items:
                product = locked_products[item.product_id]
                if product.stock_quantity < item.quantity:
                    return Response(
                        {'error': f'Only {product.stock_quantity} left for {product.name}'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            total = sum(locked_products[item.product_id].price * item.quantity for item in items)
            order = Order.objects.create(user=request.user, total_amount=total)
            for item in items:
                product = locked_products[item.product_id]
                OrderItem.objects.create(order=order, product=product, quantity=item.quantity, price=product.price)
                product.stock_quantity -= item.quantity
                product.save(update_fields=['stock_quantity'])
            cart.items.all().delete()
        return Response({'message': 'Order created successfully', 'order_id': order.id})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    orders = Order.objects.all() if request.user.is_staff else Order.objects.filter(user=request.user)

    data = [
        {
            "id": order.id,
            "user": order.user.username,
            "total_amount": order.total_amount,
                "created_at": order.created_at,
                "items": [
                    {"product": item.product.name, "quantity": item.quantity, "price": item.price}
                    for item in order.items.select_related('product')
                ],
        }
        for order in orders
    ]

    return Response(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def request_password_reset(request):
    email = request.data.get('email', '').strip()
    if not settings.EMAIL_HOST_PASSWORD:
        return Response(
            {'error': 'Email service is not configured. Please contact support.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_url = f'{settings.FRONTEND_URL.rstrip("/")}/reset-password/{uid}/{token}'
        try:
            send_mail(
                'Reset your AprilCart password',
                f'Use this link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
            )
        except Exception:
            return Response(
                {'error': 'Email could not be sent. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
    return Response({'message': 'If an account exists for that email, reset instructions have been sent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_password_reset(request):
    uid = request.data.get('uid', '')
    token = request.data.get('token', '')
    new_password = request.data.get('new_password', '')
    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'error': 'This reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({'error': 'This reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        validate_password(new_password, user)
    except Exception as error:
        return Response({'error': list(error.messages)}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Your password has been reset. You can now sign in.'})




@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    """Create a new product"""
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Product created successfully', 'product': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):
    """Update an existing product"""
    try:
        product = Product.objects.get(id=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Product updated successfully', 'product': serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    """Delete a product"""
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


#
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_category(request):
    """Create a new category"""
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Category created successfully', 'category': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_category(request, pk):
    """Update an existing category"""
    try:
        category = Category.objects.get(id=pk)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CategorySerializer(category, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Category updated successfully', 'category': serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_category(request, pk):
    """Delete a category"""
    try:
        category = Category.objects.get(id=pk)
        category.delete()
        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)


#

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    """Get all users"""
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user(request):
    """Create a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User created successfully', 'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_user(request, pk):
    """Update an existing user"""
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User updated successfully', 'user': serializer.data}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    """Delete a user"""
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "is_staff": request.user.is_staff,
    })


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile, created = Profile.objects.get_or_create(user=request.user)
    if request.method == 'GET':
        return Response(ProfileSerializer(profile, context={'request': request}).data)

    serializer = ProfileSerializer(
        profile, data=request.data, partial=True, context={'request': request}
    )
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def product_reviews(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        reviews = product.reviews.select_related('user')
        return Response(ReviewSerializer(reviews, many=True).data)

    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        if Review.objects.filter(product=product, user=request.user).exists():
            return Response({'error': 'You have already reviewed this product'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(product=product, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """Get dashboard statistics for admin"""
    total_products = Product.objects.count()
    total_categories = Category.objects.count()
    total_users = User.objects.count()
    total_orders = Order.objects.count()
    
    return Response({
        'total_products': total_products,
        'total_categories': total_categories,
        'total_users': total_users,
        'total_orders': total_orders,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    thirty_days_ago = timezone.now() - timedelta(days=29)
    orders = Order.objects.filter(created_at__gte=thirty_days_ago)
    sales = orders.annotate(date=TruncDate('created_at')).values('date').annotate(
        revenue=Sum('total_amount'),
        orders=Count('id'),
    ).order_by('date')
    top_products = OrderItem.objects.values('product__name').annotate(
        units_sold=Sum('quantity')
    ).order_by('-units_sold')[:5]
    total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0

    return Response({
        'total_revenue': total_revenue,
        'total_orders': Order.objects.count(),
        'total_products': Product.objects.count(),
        'total_users': User.objects.count(),
        'low_stock_count': Product.objects.filter(stock_quantity__lt=10).count(),
        'sales_last_30_days': list(sales),
        'top_products': [
            {'name': item['product__name'], 'units_sold': item['units_sold']}
            for item in top_products
        ],
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wishlist, created = Wishlist.objects.get_or_create(user=request.user)
    serializer = WishlistSerializer(wishlist)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get("product_id")

    product = Product.objects.get(id=product_id)

    wishlist, created = Wishlist.objects.get_or_create(user=request.user)

    WishlistItem.objects.get_or_create(
        wishlist=wishlist,
        product=product
    )

    return Response({
        "message": "Product added to wishlist",
        "wishlist": WishlistSerializer(wishlist).data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request):
    item_id = request.data.get("item_id")

    WishlistItem.objects.filter(id=item_id).delete()

    return Response({
        "message": "Product removed from wishlist"
    })
