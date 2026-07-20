from django.urls import path
from . import views 
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Product APIs
    path('products/', views.get_products, name='get_products'),
    path('products/create/', views.create_product, name='create_product'),
    path('products/<int:pk>/', views.get_product, name='get_product'),
    path('products/<int:pk>/update/', views.update_product, name='update_product'),
    path('products/<int:pk>/delete/', views.delete_product, name='delete_product'),
    path('products/<int:product_id>/reviews/', views.product_reviews, name='product_reviews'),
    
    

    # Category APIs
    path('categories/', views.get_categories, name='get_categories'),
    path('categories/create/', views.create_category, name='create_category'),
    path('categories/<int:pk>/update/', views.update_category, name='update_category'),
    path('categories/<int:pk>/delete/', views.delete_category, name='delete_category'),
    
    # User APIs
    path('users/', views.get_users, name='get_users'),
    path('users/create/', views.create_user, name='create_user'),
    path('users/<int:pk>/update/', views.update_user, name='update_user'),
    path('users/<int:pk>/delete/', views.delete_user, name='delete_user'),
    
    # Cart APIs
    path('cart/', views.get_cart),
    path('cart/add/', views.add_to_cart),
    path('cart/remove/', views.remove_from_cart),
    path('cart/update/', views.update_cart_quantity),
    path('orders/create/', views.create_order),

    path('orders/', views.get_orders, name='get_orders'),
    path('me/', views.current_user, name='current_user'),
    path('profile/', views.profile_view, name='profile'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),

    path("wishlist/", views.get_wishlist),
    path("wishlist/add/", views.add_to_wishlist),
    path("wishlist/remove/", views.remove_from_wishlist),
]
