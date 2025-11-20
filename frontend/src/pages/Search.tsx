import { useEffect, useState } from 'react';
import { fetchProducts } from '../api';
import type { Product } from '../api';
import ProductCard from '../components/ProductCard';
import { useCartDispatch } from '../context/CartContext';

const SEARCH_QUERY_KEY = 'smartretail_search_query';
const SEARCH_PAGE_KEY = 'smartretail_search_page';

export default function SearchPage() {
 
  const [query, setQuery] = useState(() => {
    return localStorage.getItem(SEARCH_QUERY_KEY) || '';
  });

  const [page, setPage] = useState(() => {
    const stored = localStorage.getItem(SEARCH_PAGE_KEY);
    return stored ? parseInt(stored, 10) : 1;
  });
  const [data, setData] = useState<{ results: Product[]; count: number; next: string | null; previous: string | null }>({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useCartDispatch();

  useEffect(() => {
    localStorage.setItem(SEARCH_QUERY_KEY, query);
  }, [query]);

  useEffect(() => {
    localStorage.setItem(SEARCH_PAGE_KEY, String(page));
  }, [page]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts(query, page)
      .then(d => {
        setData(d);
        setError(null);  // Clear error on success
      })
      .catch((e) => {
        setData({ results: [], count: 0, next: null, previous: null });
        setError(e.message || 'Error al cargar productos. Por favor, verifica tu conexión.');
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  function addToCart(product: Product) {
    dispatch({ type: 'ADD', payload: { id: product.id, quantity: 1, product } });
  }

  return (
    <div>
      <h2>Buscar Productos</h2>
      <input value={query} 
      onChange={e => {
          setQuery(e.target.value);
          setPage(1);
        }} 
        placeholder="Busca algún producto..." />
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <div style={{ 
          padding: 12, 
          backgroundColor: 'rgba(134, 6, 6, 1)', 
          border: '1px solid #fcc',
          borderRadius: 6,
          marginTop: 12
        }}>
          <strong>Error:</strong> {error}
          <br />
          <button 
            onClick={() => {
              setError(null);
              fetchProducts(query, page)
                .then(d => setData(d))
                .catch(e => setError(e.message));
            }}
            style={{ marginTop: 8 }}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          <p>{data.count} resultados</p>
          {data.count === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              No se encontraron productos{query ? ` para "${query}"` : ''}.
            </p>
          ) : (
            <div>
              {data.results.map(p => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
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