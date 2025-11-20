import type { Product } from '../api';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

function getLetterColor(letter?: string): string {
  switch (letter) {
    case 'A': return '#4CAF50'; // Green
    case 'B': return '#8BC34A'; // Light green
    case 'C': return '#FFC107'; // Yellow
    case 'D': return '#FF9800'; // Orange
    case 'E': return '#F44336'; // Red
    default: return '#999';     // Gray
  }
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: 12, 
      borderRadius: 6, 
      marginBottom: 8,
      position: 'relative'
    }}>
      {product.sustainability_letter && (
        <div style={{
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: getLetterColor(product.sustainability_letter),
          color: 'white',
          width: 40,
          height: 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 20,
        }}>
          {product.sustainability_letter}
        </div>
      )}
      
      <h3>{product.name}</h3>
      
      <div>
        <strong>Marca:</strong> {product.brand || '—'}
      </div>
      <div>
        <strong>Categoría:</strong> {product.category || '—'}
      </div>
      <div>
        <strong>Precio:</strong> ${product.price ?? '—'}
      </div>
      
      {product.sustainability_score !== undefined && (
        <div style={{ 
          marginTop: 8, 
          padding: 8, 
          backgroundColor: '#009431ff',
          borderRadius: 4,
          fontSize: 12
        }}>
          <div><strong>Puntuación Sostenibilidad:</strong> {product.sustainability_score}/100</div>
          {product.nutri_score !== undefined && (
            <div>Nutricional: {product.nutri_score}/100</div>
          )}
          {product.env_score !== undefined && (
            <div>Ambiental: {product.env_score}/100</div>
          )}
        </div>
      )}
      
      <div style={{ fontSize: 12, color: '#444', marginTop: 8 }}>
        <span>CO₂: {product.co2_kg ?? '—'} kg</span>
        {' • '}
        <span>Agua: {product.water_liters ?? '—'} L</span>
      </div>
      
      <button 
        onClick={() => onAdd(product)} 
        style={{ marginTop: 8 }}
      >
        Añadir al carrito
      </button>
    </div>
  );
}