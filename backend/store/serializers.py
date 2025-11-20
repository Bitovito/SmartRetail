from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    nutri_score = serializers.FloatField(read_only=True)
    env_score = serializers.FloatField(read_only=True)
    sustainability_score = serializers.FloatField(read_only=True)
    sustainability_letter = serializers.CharField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'category', 'price',
            'protein_g', 'fat_g', 'carbs_g', 'sodium_mg', 'fiber_g',
            'co2_kg', 'water_liters', 'land_m2',
            'source',
            'nutri_score',
            'env_score',
            'sustainability_score',
            'sustainability_letter',
        ]