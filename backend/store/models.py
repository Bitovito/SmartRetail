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

    def __str__(self):
        return f"{self.name} ({self.sku})"
    
    # Funciones auxiliares para calculo de puntaje sostenibilidad.
    
    @staticmethod
    def _minmax_normalize(value, min_val, max_val):
        """Normalizar valor de 0 a 1 usando min-max"""
        if min_val == max_val:
            return 0.5
        return (value - min_val) / (max_val - min_val)
    
    @staticmethod
    def _get_category_stats(category):
        """Obtener estadísticas min/max para una categoría para normalización"""
        products = Product.objects.filter(category=category)
        
        if not products.exists():
            return None
        
        from django.db.models import Min, Max
        
        stats = products.aggregate(
            protein_min=Min('protein_g'),
            protein_max=Max('protein_g'),
            fiber_min=Min('fiber_g'),
            fiber_max=Max('fiber_g'),
            fat_min=Min('fat_g'),
            fat_max=Max('fat_g'),
            sodium_min=Min('sodium_mg'),
            sodium_max=Max('sodium_mg'),
            co2_min=Min('co2_kg'),
            co2_max=Max('co2_kg'),
            water_min=Min('water_liters'),
            water_max=Max('water_liters'),
            land_min=Min('land_m2'),
            land_max=Max('land_m2'),
        )
        
        return stats
    
    # ---------------------------
    # NUTRISCORE (N_score)
    # ---------------------------
    
    @property
    def nutri_score(self):
        """
        Puntaje nutricional (0-100):
        + proteina (positivo)
        + fibra (positivo)
        - grasa (negativo)
        - sodio (negativo)
        """
        # Check if we have the required fields
        if None in [self.protein_g, self.fiber_g, self.fat_g, self.sodium_mg]:
            return None
        
        stats = self._get_category_stats(self.category)
        if not stats:
            return 50.0  # Default if no category data
        
        # Normalize each component (0-1)
        prot = self._minmax_normalize(self.protein_g, stats['protein_min'], stats['protein_max'])
        fibr = self._minmax_normalize(self.fiber_g, stats['fiber_min'], stats['fiber_max'])
        fat = self._minmax_normalize(self.fat_g, stats['fat_min'], stats['fat_max'])
        sod = self._minmax_normalize(self.sodium_mg, stats['sodium_min'], stats['sodium_max'])
        
        # Formula: positives - negatives
        raw = prot + fibr - fat - sod
        
        # Clamp to -2..2 range, then scale to 0..100
        raw_clamped = max(-2, min(2, raw))
        score = (raw_clamped + 2) / 4 * 100
        
        return round(score, 1)
    
    @property
    def env_score(self):
        """
        Puntaje ambiental (0-100) donde 100 = más sostenible:
        - CO2 (peso 0.5)
        - agua (peso 0.3)
        - tierra (peso 0.2)
        """
        
        if None in [self.co2_kg, self.water_liters, self.land_m2]:
            return None
        
        stats = self._get_category_stats(self.category)
        if not stats:
            return 50.0
        
        co2 = self._minmax_normalize(self.co2_kg, stats['co2_min'], stats['co2_max'])
        wat = self._minmax_normalize(self.water_liters, stats['water_min'], stats['water_max'])
        lan = self._minmax_normalize(self.land_m2, stats['land_min'], stats['land_max'])
        
        combined = 0.5 * co2 + 0.3 * wat + 0.2 * lan
        
        inv = 1 - combined
        
        return round(max(0, min(100, inv * 100)), 1)
    
    
    @property
    def sustainability_score(self):
        """
        Puntaje combinado: 30% nutricional + 70% ambiental
        """
        n_score = self.nutri_score
        e_score = self.env_score
        
        if n_score is None or e_score is None:
            return None
        
        return round(0.3 * n_score + 0.7 * e_score, 1)
    
    @property
    def sustainability_letter(self):
        """
        Convertir el puntaje de sostenibilidad a una calificación en letras (A-E)
        """
        score = self.sustainability_score
        if score is None:
            return None
        
        if score >= 80:
            return "A"
        elif score >= 65:
            return "B"
        elif score >= 50:
            return "C"
        elif score >= 30:
            return "D"
        else:
            return "E"