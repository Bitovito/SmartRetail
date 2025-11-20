import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import type { Product } from '../api';
import ProductCard from '../components/ProductCard';
import { useCartDispatch } from '../context/CartContext';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<{ results: Product[]; count: number; next: string | null; previous: string | null }>({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useCartDispatch();

  useEffect(() => {
    setLoading(true);
    fetchProducts(query, page)
      .then(d => setData(d))
      .catch(() => setData({ results: [], count: 0, next: null, previous: null }))
      .finally(() => setLoading(false));
  }, [query, page]);

  function addToCart(product: Product) {
    dispatch({ type: 'ADD', payload: { id: product.id, quantity: 1, product } });
  }

  return (
    <div>
      <h2>Search Products</h2>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca algún producto..." />
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <p>{data.count} resultados</p>
          <div>
            {data.results.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <button disabled={!data.previous} onClick={() => setPage(p => Math.max(1, p - 1))}>
              Anterior
            </button>
            <span style={{ margin: '0 8px' }}>Página {page}</span>
            <button disabled={!data.next} onClick={() => setPage(p => p + 1)}>
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}