import { create } from 'zustand';
import api from '@/api/api';
import type { Product, ProductFilters } from '@/types';

interface ProductState {
  products: Product[];
  categories: string[];
  selectedProduct: Product | null;
  isLoading: boolean;
  filters: ProductFilters;
  hasMore: boolean;

  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchProduct: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  category: '',
  min_price: undefined,
  max_price: undefined,
  skip: 0,
  limit: 12,
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  filters: { ...defaultFilters },
  hasMore: true,

  fetchProducts: async (filterOverrides?: ProductFilters) => {
    set({ isLoading: true });
    const filters = { ...get().filters, ...filterOverrides, skip: 0 };
    try {
      const params: Record<string, string | number> = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price !== undefined) params.min_price = filters.min_price;
      if (filters.max_price !== undefined) params.max_price = filters.max_price;
      params.skip = filters.skip ?? 0;
      params.limit = filters.limit ?? 12;

      const res = await api.get('/products', { params });
      set({
        products: res.data,
        filters,
        isLoading: false,
        hasMore: res.data.length === (filters.limit ?? 12),
      });
    } catch {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { filters, products } = get();
    const skip = (filters.skip ?? 0) + (filters.limit ?? 12);
    try {
      const params: Record<string, string | number> = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.min_price !== undefined) params.min_price = filters.min_price;
      if (filters.max_price !== undefined) params.max_price = filters.max_price;
      params.skip = skip;
      params.limit = filters.limit ?? 12;

      const res = await api.get('/products', { params });
      set({
        products: [...products, ...res.data],
        filters: { ...filters, skip },
        hasMore: res.data.length === (filters.limit ?? 12),
      });
    } catch {
      // fail silently
    }
  },

  fetchProduct: async (id: number) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/products/${id}`);
      set({ selectedProduct: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/products/categories');
      set({ categories: res.data });
    } catch {
      // fail silently
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters });
    get().fetchProducts(filters);
  },

  resetFilters: () => {
    set({ filters: { ...defaultFilters } });
    get().fetchProducts(defaultFilters);
  },
}));
