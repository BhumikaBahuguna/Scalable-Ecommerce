import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowLeft, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/StarRating';
import ProductCard from '@/components/ProductCard';
import {
  getProductImage, generateRating, generateDiscount,
  getOriginalPrice, formatPrice,
} from '@/utils/product';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct, isLoading, fetchProduct, products, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) fetchProduct(Number(id));
    if (products.length === 0) fetchProducts();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(selectedProduct!.id, quantity);
      toast.success(`Added ${quantity}x ${selectedProduct!.name}`, { icon: '🛒' });
    } catch { toast.error('Failed to add'); }
    finally { setAdding(false); }
  };

  if (isLoading || !selectedProduct) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-[420px] skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-5 w-20 skeleton rounded-full" />
            <div className="h-8 w-3/4 skeleton" />
            <div className="h-4 w-24 skeleton" />
            <div className="h-6 w-40 skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-2/3 skeleton" />
            <div className="h-12 w-full skeleton rounded-xl mt-6" />
          </div>
        </div>
      </div>
    );
  }

  const p = selectedProduct;
  const image = getProductImage(p.image_url, p.category, p.id);
  const r = generateRating(p.id);
  const disc = generateDiscount(p.id);
  const origPrice = getOriginalPrice(p.price, disc);

  // Related products (same category, exclude current)
  const related = products
    .filter((pr) => pr.category === p.category && pr.id !== p.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 transition-colors text-sm font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={18} />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl overflow-hidden relative"
        >
          <img src={image} alt={p.name} className="w-full h-[420px] object-cover" />
          {disc && (
            <span className="absolute top-4 left-4 badge badge-discount px-3 py-1.5 text-sm">
              -{disc}% OFF
            </span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="badge badge-info w-fit mb-3">{p.category}</span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            {p.name}
          </h1>

          <StarRating stars={r.stars} count={r.count} />

          {/* Price */}
          <div className="flex items-center gap-3 mt-4">
            <span className="text-3xl font-bold gradient-text">₹{formatPrice(p.price)}</span>
            {origPrice && <span className="price-original text-lg">₹{formatPrice(origPrice)}</span>}
            {disc && <span className="badge badge-accent">Save {disc}%</span>}
          </div>

          {/* Description */}
          {p.description && (
            <p className="mt-4 leading-relaxed text-sm" style={{ color: 'var(--text-secondary)' }}>
              {p.description}
            </p>
          )}

          {/* Stock */}
          <div className="mt-4">
            {p.stock > 10 ? (
              <span className="badge badge-success">✓ In Stock ({p.stock} available)</span>
            ) : p.stock > 0 ? (
              <span className="badge badge-warning">⚡ Only {p.stock} left — Hurry!</span>
            ) : (
              <span className="badge badge-error">✕ Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {p.stock > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center glass rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 transition-colors" style={{ color: 'var(--text-secondary)' }}
                >
                  <Minus size={16} />
                </button>
                <span className="px-5 py-2.5 font-semibold min-w-[3rem] text-center" style={{ color: 'var(--text-primary)' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                  className="px-3 py-2.5 transition-colors" style={{ color: 'var(--text-secondary)' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={adding}
                className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2 py-3.5 px-8 text-base disabled:opacity-50"
              >
                {adding ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Delivery' },
              { icon: Shield, label: 'Secure Payment' },
              { icon: RotateCcw, label: '7-Day Return' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="glass-light rounded-xl p-3 text-center">
                <Icon size={18} className="mx-auto mb-1" style={{ color: '#818cf8' }} />
                <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
