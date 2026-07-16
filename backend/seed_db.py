import os
import django
from django.utils.text import slugify

# Point to your settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') 
django.setup()

from store.models import Product, Category
from django.db import connection

# 1. Reset Product ID sequence
with connection.cursor() as cursor:
    cursor.execute("SELECT setval(pg_get_serial_sequence('store_product', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM store_product;")

# 2. Clear old data completely
print("Clearing old data...")
Product.objects.all().delete()
Category.objects.all().delete()

# 3. Create Categories
print("Creating categories...")
categories_list = ["Electronics", "Fashion", "Home & Office", "Fitness", "Groceries & Cleaning"]
cats = {}

for name in categories_list:
    slug = slugify(name)
    cat, created = Category.objects.get_or_create(name=name, defaults={'slug': slug})
    cats[name] = cat
    print(f"-> Category '{name}' ready.")

# 4. Create Products (Now with image paths)
print("Creating products...")
products_to_add = [
    # Electronics
    Product(name="Smartphone X", price=699.99, description="Latest model with AI camera", category=cats["Electronics"], image="products/smartphone_x.jpg"),
    Product(name="Noise Cancelling Headphones", price=199.50, description="Wireless over-ear comfort", category=cats["Electronics"], image="products/headphones.jpg"),
    Product(name="LED Light Bulb", price=8.99, description="Energy-efficient warm white LED bulb", category=cats["Electronics"], image="products/Bulb.jpeg"),
    Product(name="Electric Steam Iron", price=35.00, description="Non-stick soleplate with adjustable steam control", category=cats["Electronics"], image="products/Iron.jpeg"),
    
    # Fashion
    Product(name="Classic Denim Jacket", price=59.00, description="Vintage blue denim", category=cats["Fashion"], image="products/denim_jacket.jpg"),
    Product(name="Leather Running Shoes", price=85.00, description="Breathable daily trainers", category=cats["Fashion"], image="products/running_shoes.jpg"),
    
    # Home & Office
    Product(name="Ergonomic Desk Chair", price=150.00, description="Lumbar support office chair", category=cats["Home & Office"], image="products/desk_chair.jpg"),
    Product(name="Mechanical Keyboard", price=99.00, description="RGB tactile switches", category=cats["Home & Office"], image="products/keyboard.jpg"),
    Product(name="Wooden Countertop Counter", price=220.00, description="Premium finished solid wood surface", category=cats["Home & Office"], image="products/wood.jpeg"),
    
    # Fitness
    Product(name="Yoga Mat", price=25.00, description="Extra thick non-slip mat", category=cats["Fitness"], image="products/yoga_mat.jpg"),
    Product(name="Adjustable Dumbbell Set", price=120.00, description="5lb to 50lb range", category=cats["Fitness"], image="products/dumbbells.jpg"),

    # Groceries & Cleaning
    Product(name="Eco-Friendly Water Bottle", price=15.99, description="Matte green insulated stainless steel bottle", category=cats["Groceries & Cleaning"], image="products/Bottle.jpeg"),
    Product(name="Traditional Grass Broom", price=12.50, description="Long handle sweeping broom for indoor cleaning", category=cats["Groceries & Cleaning"], image="products/Broom.jpeg"),
    Product(name="Gentle Bar Soap", price=2.49, description="Moisturizing pink beauty bar soap", category=cats["Groceries & Cleaning"], image="products/Soap.jpeg"),
]

# 5. Bulk create products
Product.objects.bulk_create(products_to_add)
print(f"\n🎉 Successfully added {len(products_to_add)} products with images!")