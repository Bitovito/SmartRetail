from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def get_queryset(self):
        qs = super().get_queryset()
        q = self.request.query_params.get('q')
        if q:
            qs = qs.filter(
                Q(name__icontains=q) |
                Q(brand__icontains=q) |
                Q(category__icontains=q)
            )
        return qs

@api_view(['POST'])
def optimize_cart(request):
    """
    POST { "items":[{"id":..., "quantity":1}], "weights": {"price":0.5,"co2":0.5} }
    Very simple greedy optimizer: for each requested item, choose the product in the same
    category with minimal weighted (price * w_price + co2 * w_co2).
    """
    data = request.data or {}
    items = data.get('items', [])
    weights = data.get('weights', {'price': 0.5, 'co2': 0.5})
    w_price = float(weights.get('price', 0.5))
    w_co2 = float(weights.get('co2', 0.5))

    def score(p):
        return w_price * float(p.price or 0) + w_co2 * float(p.co2_kg or 0)

    suggested = []
    total_price = 0.0
    total_co2 = 0.0

    for it in items:
        prod_id = it.get('id')
        qty = int(it.get('quantity', 1))
        try:
            orig = Product.objects.get(id=prod_id)
        except Product.DoesNotExist:
            continue

        candidates = Product.objects.filter(category=orig.category)
        if candidates.exists():
            best = min(candidates, key=lambda p: score(p))
        else:
            best = orig

        suggested.append({
            'requested_id': prod_id,
            'chosen_id': best.id,
            'name': best.name,
            'quantity': qty,
            'unit_price': float(best.price or 0),
            'unit_co2_kg': float(best.co2_kg or 0),
        })
        total_price += float(best.price or 0) * qty
        total_co2 += float(best.co2_kg or 0) * qty

    return Response({
        'suggested_cart': suggested,
        'total_price': total_price,
        'total_co2_kg': total_co2,
    }, status=status.HTTP_200_OK)