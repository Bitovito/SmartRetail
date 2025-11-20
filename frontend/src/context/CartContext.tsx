import React, { createContext, useContext, useReducer } from 'react';
import type { Product } from '../api';
import type { ReactNode } from 'react';

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; payload: { id: number; quantity: number; product: Product } }
  | { type: 'REMOVE'; payload: { id: number } }
  | { type: 'SET_quantity'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR' };

const CartStateContext = createContext<CartState | undefined>(undefined);
const CartDispatchContext = createContext<React.Dispatch<CartAction> | undefined>(undefined);

const CART_STORAGE_KEY = 'smartretail_cart';

function loadCartFromStorage(): CartState {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading cart from localStorage:', e);
  }
  return { items: [] };
}

function saveCartToStorage(state: CartState) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving cart to localStorage:', e);
  }
}


function reducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case 'ADD': {
      const { id, quantity, product } = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        newState = {
          ...state,
          items: state.items.map(i => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i)),
        };
      } else {
        newState = { ...state, items: [...state.items, { id, quantity, product }] };
      }
      break;
    }
    case 'REMOVE':
      newState = { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
      break;
    case 'SET_quantity':
      newState = {
        ...state,
        items: state.items.map(i => (i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)),
      };
      break;
    case 'CLEAR':
      newState = { ...state, items: [] };
      break;
    default:
      throw new Error('Unknown action type');
  }

  saveCartToStorage(newState);
  return newState;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, loadCartFromStorage());
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

export function useCart(): CartState {
  const context = useContext(CartStateContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

export function useCartDispatch(): React.Dispatch<CartAction> {
  const context = useContext(CartDispatchContext);
  if (!context) throw new Error('useCartDispatch must be used within a CartProvider');
  return context;
}