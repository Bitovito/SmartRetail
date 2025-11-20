import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SearchPage from './pages/Search';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <nav style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
          <Link to="/">Buscar Productos</Link>
          {' | '}
          <Link to="/cart">Carrito</Link>
        </nav>
        
        <div style={{ padding: 12 }}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}