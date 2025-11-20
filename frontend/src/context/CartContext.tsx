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

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const { id, quantity, product } = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i)),
        };
      }
      return { ...state, items: [...state.items, { id, quantity, product }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.payload.id) };
    case 'SET_quantity':
      return {
        ...state,
        items: state.items.map(i => (i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i)),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      throw new Error('Unknown action type');
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });
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