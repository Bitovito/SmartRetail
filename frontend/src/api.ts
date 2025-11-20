const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  protein_g?: number;
  fat_g?: number;
  carbs_g?: number;
  sodium_mg?: number;
  fiber_g?: number;
  co2_kg?: number;
  water_liters?: number;
  land_m2?: number;
  source?: string;
}

export interface OptimizeCartResponse {
  suggested_cart: {
    requested_id: number;
    chosen_id: number;
    name: string;
    quantity: number;
    unit_price: number;
    unit_co2_kg: number;
  }[];
  total_price: number;
  total_co2_kg: number;
}

export async function fetchProducts(q: string = '', page: number = 1): Promise<{ count: number; next: string | null; previous: string | null; results: Product[] }> {
  const url = new URL(`${BASE}/api/products/`);
  if (q){
   url.searchParams.set('q', q);
  }
  if (page) {
    url.searchParams.set('page', String(page));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed fetching products');
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/api/products/${id}/`);
  if (!res.ok) throw new Error('Failed fetching product');
  return res.json();
}

export async function optimizeCart( items: { id: number; quantity: number }[], weights: { price: number; co2: number }): Promise<OptimizeCartResponse> {
  const res = await fetch(`${BASE}/api/optimize/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, weights }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Optimize failed: ${text}`);
  }
  return res.json();
}