// Utility helpers for enriching product data

const FALLBACK_IMAGES: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
  "men's clothing": 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
  "women's dresses": 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop',
  "women's sarees": 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
  "women's suits": 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop',
  "women's jeans": 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop',
  "kids wear": 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop',
  cosmetics: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
  "home & living": 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  "sports & fitness": 'https://images.unsplash.com/photo-1461896836934-bd45ba8a0bca?w=400&h=300&fit=crop',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
  general: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
};

const GENERIC_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=300&fit=crop',
];

export function getProductImage(imageUrl: string | null, category: string, productId: number): string {
  if (imageUrl) return imageUrl;
  const catImage = FALLBACK_IMAGES[category.toLowerCase()];
  if (catImage) return catImage;
  return GENERIC_IMAGES[productId % GENERIC_IMAGES.length];
}

export function generateRating(productId: number): { stars: number; count: number } {
  const stars = 3.5 + ((productId * 7 + 3) % 15) / 10;
  const count = 10 + ((productId * 31 + 7) % 490);
  return { stars: Math.round(stars * 10) / 10, count };
}

export function generateDiscount(productId: number): number | null {
  if (productId % 5 < 2) return null;
  return 5 + ((productId * 13 + 11) % 46);
}

export function getOriginalPrice(price: number, discount: number | null): number | null {
  if (!discount) return null;
  return Math.round((price / (1 - discount / 100)) * 100) / 100;
}

export function formatPrice(price: number): string {
  return price.toLocaleString('en-IN');
}

const CATEGORY_ICONS: Record<string, string> = {
  electronics: '💻',
  "men's clothing": '👔',
  "women's dresses": '👗',
  "women's sarees": '🥻',
  "women's suits": '👘',
  "women's jeans": '👖',
  "kids wear": '🧒',
  cosmetics: '💄',
  shoes: '👟',
  "home & living": '🏠',
  accessories: '⌚',
  "sports & fitness": '🏋️',
  books: '📚',
  general: '📦',
};

export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category.toLowerCase()] || '📦';
}
