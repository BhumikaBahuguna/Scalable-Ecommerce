import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import ProductCard from '@/components/ProductCard';
import { getCategoryIcon } from '@/utils/product';

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest';

export default function ProductsPage() {
  const {
    products, categories, isLoading, hasMore, filters,
    fetchProducts, fetchCategories, setFilters, resetFilters, loadMore,
  } = useProductStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Initialize from URL params
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setFilters({ category: cat });
    } else {
      fetchProducts();
    }
    fetchCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) setFilters({ search: searchInput });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sort products client-side
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc': return a.price - b.price;
      case 'price_desc': return b.price - a.price;
      case 'newest': return b.id - a.id;
      default: return 0;
    }
  });

  const handleCategoryClick = (cat: string) => {
    if (filters.category === cat) {
      setFilters({ category: '' });
      setSearchParams({});
    } else {
      setFilters({ category: cat });
      setSearchParams({ category: cat });
    }
  };

  const handleClearAll = () => {
    resetFilters();
    setSearchInput('');
    setSortBy('default');
    setSearchParams({});
  };

  const activeFilterCount = [filters.category, filters.min_price, filters.max_price].filter(Boolean).length;

  /* ── Sidebar ── */
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Categories
        </h3>
        <div className="space-y-0.5">
          <button
            onClick={() => { setFilters({ category: '' }); setSearchParams({}); }}
            className={`cat-item w-full text-left ${!filters.category ? 'active' : ''}`}
          >
            <span>📦</span>
            <span>All Products</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`cat-item w-full text-left ${filters.category === cat ? 'active' : ''}`}
            >
              <span>{getCategoryIcon(cat)}</span>
              <span className="capitalize">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Price Range
        </h3>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={filters.min_price ?? ''}
              onChange={(e) => setFilters({ min_price: e.target.value ? Number(e.target.value) : undefined })}
              className="input-field text-sm py-2"
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={filters.max_price ?? ''}
              onChange={(e) => setFilters({ max_price: e.target.value ? Number(e.target.value) : undefined })}
              className="input-field text-sm py-2"
            />
          </div>
          {/* Quick price ranges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Under ₹500', min: 0, max: 500 },
              { label: '₹500–₹2K', min: 500, max: 2000 },
              { label: '₹2K–₹10K', min: 2000, max: 10000 },
              { label: '₹10K+', min: 10000, max: undefined },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => setFilters({ min_price: range.min, max_price: range.max })}
                className="text-[11px] px-2.5 py-1 rounded-lg transition-colors"
                style={{
                  background: 'var(--bg-input)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Availability
        </h3>
        <label className="flex items-center gap-2 cursor-pointer cat-item">
          <input type="checkbox" className="rounded accent-brand-500" />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button onClick={handleClearAll} className="text-sm font-medium w-full py-2 rounded-lg transition-colors" style={{ color: '#818cf8' }}>
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {filters.category ? (
              <span className="capitalize">{getCategoryIcon(filters.category)} {filters.category}</span>
            ) : 'All Products'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(''); setFilters({ search: '' }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="input-field text-sm py-2.5 pr-10 appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="default">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest First</option>
          </select>
          <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden btn-secondary flex items-center gap-2 text-sm"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full gradient-bg text-[10px] text-white font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden mb-6"
          >
            <div className="glass rounded-xl p-5">
              <FilterSidebar />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="glass rounded-xl p-5 sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="h-52 skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 skeleton rounded-full" />
                    <div className="h-4 w-3/4 skeleton" />
                    <div className="h-3 w-24 skeleton" />
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-6 w-20 skeleton" />
                    </div>
                    <div className="h-10 skeleton rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center">
              <Search size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No products found</h3>
              <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
              <button onClick={handleClearAll} className="btn-primary text-sm">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button onClick={loadMore} className="btn-secondary flex items-center gap-2 text-sm">
                    <ChevronDown size={16} />
                    Load More Products
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
