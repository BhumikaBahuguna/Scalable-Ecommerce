import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import api from '@/api/api';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try { const res = await api.get('/orders'); setOrders(res.data); }
      catch {} finally { setIsLoading(false); }
    })();
  }, []);

  const statusColor = (s: string) => {
    switch (s.toUpperCase()) {
      case 'PLACED': return 'badge-info';
      case 'SHIPPED': return 'badge-warning';
      case 'DELIVERED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-info';
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="h-8 w-40 skeleton mb-6" />
        {[1, 2, 3].map(i => <div key={i} className="glass rounded-xl p-5 mb-3"><div className="h-12 skeleton" /></div>)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <Package size={64} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>No orders yet</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Orders</h1>
      <div className="space-y-3">
        {orders.map(order => (
          <motion.div key={order.order_id} layout className="glass rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === order.order_id ? null : order.order_id)}
              className="w-full p-5 flex items-center justify-between transition-colors"
            >
              <div className="text-left">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Order #{order.order_id}</h3>
                  <span className={`badge ${statusColor(order.status)}`}>{order.status}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold gradient-text">₹{order.total_amount.toLocaleString()}</span>
                {expandedId === order.order_id ? <ChevronUp size={18} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />}
              </div>
            </button>
            <AnimatePresence>
              {expandedId === order.order_id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <table className="w-full">
                      <thead>
                        <tr className="text-xs uppercase" style={{ color: 'var(--text-muted)' }}>
                          <th className="text-left pb-2">Product</th>
                          <th className="text-right pb-2">Price</th>
                          <th className="text-right pb-2">Qty</th>
                          <th className="text-right pb-2">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} style={{ borderTop: '1px solid var(--border-subtle)' }} className="text-sm">
                            <td className="py-2" style={{ color: 'var(--text-primary)' }}>{item.name}</td>
                            <td className="py-2 text-right" style={{ color: 'var(--text-muted)' }}>₹{item.price.toLocaleString()}</td>
                            <td className="py-2 text-right" style={{ color: 'var(--text-muted)' }}>{item.quantity}</td>
                            <td className="py-2 text-right font-medium" style={{ color: 'var(--text-primary)' }}>₹{item.subtotal.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
