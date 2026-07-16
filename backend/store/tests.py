from django.contrib.auth.models import User
from django.db import IntegrityError
from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Cart, CartItem, Category, Product, Review


class StockAndReviewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='secret123')
        self.category = Category.objects.create(name='Electronics', slug='electronics')

    def test_create_order_decrements_stock_when_available(self):
        product = Product.objects.create(
            category=self.category,
            name='Phone',
            description='Great phone',
            price='499.99',
            stock_quantity=2,
        )
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=product, quantity=1)

        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('create_order'), {
            'name': 'Tester',
            'address': '123 Main St',
            'phone': '1234567890',
            'payment_method': 'COD',
        })

        self.assertEqual(response.status_code, 200)
        product.refresh_from_db()
        self.assertEqual(product.stock_quantity, 1)

    def test_create_order_rejects_insufficient_stock(self):
        product = Product.objects.create(
            category=self.category,
            name='Laptop',
            description='Fast laptop',
            price='999.99',
            stock_quantity=1,
        )
        cart = Cart.objects.create(user=self.user)
        CartItem.objects.create(cart=cart, product=product, quantity=2)

        self.client.force_authenticate(user=self.user)
        response = self.client.post(reverse('create_order'), {
            'name': 'Tester',
            'address': '123 Main St',
            'phone': '1234567890',
            'payment_method': 'COD',
        })

        self.assertEqual(response.status_code, 400)
        product.refresh_from_db()
        self.assertEqual(product.stock_quantity, 1)

    def test_review_unique_per_user_and_product(self):
        product = Product.objects.create(
            category=self.category,
            name='Headphones',
            description='Noise cancelling',
            price='129.99',
            stock_quantity=10,
        )

        Review.objects.create(product=product, user=self.user, rating=5, comment='Loved it')

        with self.assertRaises(IntegrityError):
            Review.objects.create(product=product, user=self.user, rating=4, comment='Another review')
