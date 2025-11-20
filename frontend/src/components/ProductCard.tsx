import type { Product } from '../api';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, marginBottom: 8 }}>
      <h3>{product.name}</h3>
      <div>
        <strong>Brand:</strong> {product.brand || '—'}
      </div>
      <div>
        <strong>Category:</strong> {product.category || '—'}
      </div>
      <div>
        <strong>Price:</strong> ${product.price ?? '—'}
      </div>
      <div style={{ fontSize: 12, color: '#444' }}>
        <span>CO₂: {product.co2_kg ?? '—'} kg</span> • <span>Water: {product.water_liters ?? '—'} L</span>
      </div>
      <button onClick={() => onAdd(product)} style={{ marginTop: 8 }}>
        Add to cart
      </button>
    </div>
  );
}