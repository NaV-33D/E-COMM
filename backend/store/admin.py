from django.contrib import admin
from .models import Category, Product, UserProfile, Profile, Order, OrderItem, Review

# Register your models here.
admin.site.register(Category)
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'created_at')


admin.site.register(UserProfile)
admin.site.register(Profile)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)
