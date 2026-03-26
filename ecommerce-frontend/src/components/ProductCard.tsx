import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/StarRating';
import {
  getProductImage,
  generateRating,
  generateDiscount,
  getOriginalPrice,
  formatPrice,
} from '@/utils/product';
import toast from 'react-hot-toast';
import type { Product } from '@/types';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const image = getProductImage(product.image_url, product.category, product.id);
  const rating = generateRating(product.id);
  const discount = generateDiscount(product.id);
  const originalPrice = getOriginalPrice(product.price, discount);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    try {
      await addToCart(product.id);
      toast.success(`Added to cart!`, { icon: '🛒' });
    } catch {
      toast.error('Failed to add');
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl overflow-hidden cursor-pointer group"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden" style={{ background: 'var(--bg-input)' }}>
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover img-zoom"
          loading="lazy"
        />

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 badge badge-discount text-[10px] px-2 py-1">
            -{discount}%
          </span>
        )}

        {/* Stock badge */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 badge badge-warning text-[10px]">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 badge badge-error text-[10px]">
            Out of stock
          </span>
        )}

        {/* Quick actions overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white mr-2 hover:bg-white/30 transition-colors"
          >
            <Eye size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors disabled:opacity-40"
          >
            {adding ? (
              <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ShoppingCart size={18} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <span className="badge badge-info text-[10px] mb-2">{product.category}</span>

        {/* Title */}
        <h3
          className="font-semibold truncate mb-1 transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <StarRating stars={rating.stars} count={rating.count} />

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold gradient-text">
            ₹{formatPrice(product.price)}
          </span>
          {originalPrice && (
            <span className="price-original">₹{formatPrice(originalPrice)}</span>
          )}
        </div>

        {/* Add to Cart button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="btn-primary w-full mt-3 text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
}
