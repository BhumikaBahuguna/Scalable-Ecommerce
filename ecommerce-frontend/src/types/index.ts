// ──── User Types ────
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ──── Product Types ────
export interface Product {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  image_url: string | null;
}

export interface ProductCreate {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image_url?: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  stock?: number;
  image_url?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  skip?: number;
  limit?: number;
}

// ──── Cart Types ────
export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total_amount: number;
}

export interface CartAdd {
  product_id: number;
  quantity: number;
}

export interface CartUpdate {
  quantity: number;
}

// ──── Order Types ────
export interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  order_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderPlaced {
  message: string;
  order_id: number;
  total_amount: number;
}
