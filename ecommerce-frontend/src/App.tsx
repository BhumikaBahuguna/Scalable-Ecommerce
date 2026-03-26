import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useThemeStore } from '@/store/themeStore';

import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

import LoginPage from '@/pages/Login';
import SignupPage from '@/pages/Signup';
import ProductsPage from '@/pages/Products';
import ProductDetailPage from '@/pages/ProductDetail';
import CartPage from '@/pages/Cart';
import OrdersPage from '@/pages/Orders';
import ProfilePage from '@/pages/Profile';
import AdminDashboard from '@/pages/AdminDashboard';

export default function App() {
  const { initialize, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { theme } = useThemeStore();

  // Initialize theme class on mount
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => { initialize(); }, []);
  useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
