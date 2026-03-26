import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { getProductImage } from '@/utils/product';
import toast from 'react-hot-toast';
import api from '@/api/api';

export default function CartPage() {
  const { cart, isLoading, fetchCart, updateItem, removeItem } = useCartStore();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    try {
      if (newQty <= 0) { await removeItem(itemId); toast.success('Item removed'); }
      else { await updateItem(itemId, newQty); }
    } catch { toast.error('Failed to update'); }
  };

  const handleRemove = async (itemId: number) => {
    try { await removeItem(itemId); toast.success('Item removed', { icon: '🗑️' }); }
    catch { toast.error('Failed to remove'); }
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      await api.post('/orders/place');
      toast.success('Order placed! 🎉');
      await fetchCart();
      navigate('/orders');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed');
    } finally { setPlacingOrder(false); }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-40 skeleton mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-4 flex gap-4 mb-3">
            <div className="h-20 w-20 skeleton rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/2 skeleton" />
              <div className="h-4 w-24 skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <ShoppingCart size={64} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Your cart is empty</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>Add some products to get started</p>
        <button onClick={() => navigate('/products')} className="btn-primary">Browse Products</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Shopping Cart
        <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-muted)' }}>
          ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)
        </span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                className="glass rounded-xl p-4 flex items-center gap-4"
              >
                {/* Product Image */}
                <div
                  onClick={() => navigate(`/products/${item.product_id}`)}
                  className="h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
                  style={{ background: 'var(--bg-input)' }}
                >
                  <img
                    src={getProductImage(null, 'general', item.product_id)}
                    alt={item.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>₹{item.price.toLocaleString()} each</p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1 glass-light rounded-lg">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 transition-colors" style={{ color: 'var(--text-secondary)' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 transition-colors" style={{ color: 'var(--text-secondary)' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-sm font-bold w-24 text-right gradient-text">
                  ₹{item.subtotal.toLocaleString()}
                </p>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-red-500/10"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass rounded-xl p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Order Summary</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                <span>₹{cart.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span className="text-emerald-500 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>Tax</span>
                <span>Included</span>
              </div>
              <div className="pt-3 flex justify-between" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Total</span>
                <span className="text-xl font-bold gradient-text">₹{cart.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-50"
            >
              {placingOrder ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Place Order
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              🔒 Secure checkout · Free shipping · 7-day returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
