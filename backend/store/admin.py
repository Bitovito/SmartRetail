from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'brand', 'category', 'price', 'co2_kg')
    search_fields = ('name', 'brand', 'category')
    list_filter = ('category', 'brand')