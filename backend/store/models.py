from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=500, db_index=True)
    brand = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=200, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    protein_g = models.FloatField(null=True, blank=True)
    fat_g = models.FloatField(null=True, blank=True)
    carbs_g = models.FloatField(null=True, blank=True)
    sodium_mg = models.FloatField(null=True, blank=True)
    fiber_g = models.FloatField(null=True, blank=True)
    
    co2_kg = models.FloatField(null=True, blank=True)
    water_liters = models.FloatField(null=True, blank=True)
    land_m2 = models.FloatField(null=True, blank=True)

    source = models.CharField(max_length=200, blank=True)
    raw = models.JSONField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.sku})"