import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, User, LogOut, Package, LayoutDashboard,
  Menu, X, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useProductStore } from '@/store/productStore';
import { getCategoryIcon } from '@/utils/product';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.itemCount());
  const { categories, fetchCategories } = useProductStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const catMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { setMobileOpen(false); setCatMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (catMenuRef.current && !catMenuRef.current.contains(e.target as Node)) setCatMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="glass sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-bg shadow-md">
              <ShoppingCart size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:block">ShopScale</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/products"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: location.pathname === '/products' ? '#818cf8' : 'var(--text-secondary)' }}
            >
              Products
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={catMenuRef}>
              <button
                onClick={() => setCatMenuOpen(!catMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                Categories
                <ChevronDown size={14} className={`transition-transform ${catMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="glass absolute left-0 mt-1 w-56 rounded-xl p-2 shadow-xl z-50"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { navigate(`/products?category=${cat}`); setCatMenuOpen(false); }}
                        className="cat-item w-full text-left"
                      >
                        <span>{getCategoryIcon(cat)}</span>
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: location.pathname === '/admin' ? '#818cf8' : 'var(--text-secondary)' }}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ShoppingCart size={20} />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full gradient-bg text-[10px] font-bold text-white"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-xl p-1.5 transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg text-xs font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden lg:block" style={{ color: 'var(--text-primary)' }}>
                      {user?.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="glass absolute right-0 mt-2 w-56 rounded-xl p-2 shadow-xl z-50"
                      >
                        <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                        </div>
                        {[
                          { to: '/profile', icon: User, label: 'Profile' },
                          { to: '/orders', icon: Package, label: 'My Orders' },
                          ...(user?.role === 'admin' ? [{ to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' }] : []),
                        ].map(({ to, icon: Icon, label }) => (
                          <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <Icon size={16} />
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-1 pt-2"
                          style={{ borderTop: '1px solid var(--border-subtle)' }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <div className="px-4 py-3 space-y-1">
              <Link to="/products" className="block cat-item">Products</Link>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/products?category=${cat}`)}
                  className="cat-item w-full text-left pl-6"
                >
                  <span>{getCategoryIcon(cat)}</span>
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
