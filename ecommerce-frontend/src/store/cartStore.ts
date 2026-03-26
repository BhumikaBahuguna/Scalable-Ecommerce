import { create } from 'zustand';
import api from '@/api/api';
import type { Cart, CartItem } from '@/types';

interface CartState {
  cart: Cart;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearLocal: () => void;
  itemCount: () => number;
}

const emptyCart: Cart = { items: [], total_amount: 0 };

export const useCartStore = create<CartState>((set, get) => ({
  cart: emptyCart,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      set({ cart: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await api.post('/cart/add', {
      product_id: productId,
      quantity,
    });
    set({ cart: res.data });
  },

  updateItem: async (itemId, quantity) => {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    set({ cart: res.data });
  },

  removeItem: async (itemId) => {
    const res = await api.delete(`/cart/${itemId}`);
    set({ cart: res.data });
  },

  clearLocal: () => set({ cart: emptyCart }),

  itemCount: () => {
    return get().cart.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  },
}));
