import { useState } from 'react';
import { useCart, useCartDispatch } from '../context/CartContext';
import { optimizeCart } from '../api';
import type { OptimizeCartResponse } from '../api';

export default function CartPage() {
  const { items } = useCart();
  
  const dispatch = useCartDispatch();
  
  const [optimizing, setOptimizing] = useState(false);
  const [suggestion, setSuggestion] = useState<OptimizeCartResponse | null>(null);

  const itemsPayload = items.map(i => ({ id: i.id, quantity: i.quantity }));

  async function onOptimize() {
    setOptimizing(true);
    try {
      const res = await optimizeCart(itemsPayload, { price: 0.5, co2: 0.5 });
      setSuggestion(res);
    } catch (e) {
      alert('Error al optimizar: ' + (e as Error).message);
    } finally {
      setOptimizing(false);
    }
  }

  return (
    <div>
      <h2>Carrito de Compras</h2>
      
      {items.length === 0 && <p>El carrito está vacío</p>}
      
      {items.map(i => (
        <div key={i.id} style={{ borderBottom: '1px solid #eee', padding: 8 }}>
          <div>
            <strong>{i.product.name}</strong>
          </div>
          <div>Cantidad: {i.quantity}</div>
          <div>Precio unitario: ${i.product.price}</div>
          <div>Subtotal: ${(i.product.price * i.quantity).toFixed(2)}</div>
          <button onClick={() => dispatch({ type: 'REMOVE', payload: { id: i.id } })}>
            Eliminar
          </button>
        </div>
      ))}
      
      <div style={{ marginTop: 12 }}>
        <button onClick={onOptimize} disabled={optimizing || items.length === 0}>
          {optimizing ? 'Optimizando...' : 'Optimizar carrito'}
        </button>
      </div>

      {suggestion && (
        <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
          <h3>Carrito Sugerido</h3>
          <div>
            <strong>Precio total:</strong> ${suggestion.total_price.toFixed(2)}
          </div>
          <div>
            <strong>CO₂ total:</strong> {suggestion.total_co2_kg.toFixed(2)} kg
          </div>
          <ul style={{ marginTop: 12 }}>
            {suggestion.suggested_cart.map(s => (
              <li key={s.chosen_id}>
                <strong>{s.name}</strong> — Cantidad: {s.quantity} — ${s.unit_price} — CO₂: {s.unit_co2_kg} kg
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}