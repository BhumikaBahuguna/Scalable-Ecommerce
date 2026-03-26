"""
Seed the database with 50+ products across diverse categories.
Run: python seed_products.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine
from app.models import Base, Product

# Create tables if not exist
Base.metadata.create_all(bind=engine)

PRODUCTS = [
    # ──── Electronics ────
    {"name": "iPhone 15 Pro Max", "description": "Apple's flagship with A17 Pro chip, titanium design, and 48MP camera system.", "category": "Electronics", "price": 134900, "stock": 25, "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop"},
    {"name": "Samsung Galaxy S24 Ultra", "description": "AI-powered smartphone with S Pen, 200MP camera, and titanium frame.", "category": "Electronics", "price": 129999, "stock": 18, "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop"},
    {"name": "MacBook Air M3", "description": "Incredibly thin laptop with M3 chip, 18-hour battery, and Liquid Retina display.", "category": "Electronics", "price": 114900, "stock": 12, "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop"},
    {"name": "Sony WH-1000XM5", "description": "Industry-leading noise cancelling headphones with 30hr battery.", "category": "Electronics", "price": 29990, "stock": 40, "image_url": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop"},
    {"name": "iPad Air M2", "description": "Powerful tablet with M2 chip, 11-inch Liquid Retina display, and Apple Pencil support.", "category": "Electronics", "price": 74900, "stock": 20, "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop"},
    {"name": "JBL Flip 6 Speaker", "description": "Portable Bluetooth speaker with powerful bass, IP67 waterproof.", "category": "Electronics", "price": 9999, "stock": 55, "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"},
    {"name": "Apple Watch Series 9", "description": "Advanced health tracking, always-on display, and double tap gesture.", "category": "Electronics", "price": 41900, "stock": 30, "image_url": "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=300&fit=crop"},
    {"name": "Canon EOS R50 Camera", "description": "Mirrorless camera with 24.2MP sensor, 4K video, and eye autofocus.", "category": "Electronics", "price": 75990, "stock": 8, "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop"},

    # ──── Men's Clothing ────
    {"name": "Premium Slim Fit Blazer", "description": "Tailored navy blue blazer, perfect for formal occasions and office wear.", "category": "Men's Clothing", "price": 4999, "stock": 35, "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop"},
    {"name": "Classic Denim Jacket", "description": "Vintage wash denim jacket with button closure and chest pockets.", "category": "Men's Clothing", "price": 2499, "stock": 45, "image_url": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=300&fit=crop"},
    {"name": "Casual Cotton Polo T-Shirt", "description": "Breathable cotton polo in 6 colors, ribbed collar and cuffs.", "category": "Men's Clothing", "price": 899, "stock": 100, "image_url": "https://images.unsplash.com/photo-1625910513413-5fc421e0e5f0?w=400&h=300&fit=crop"},
    {"name": "Men's Tapered Chinos", "description": "Stretch cotton chinos with tapered fit for a modern silhouette.", "category": "Men's Clothing", "price": 1799, "stock": 60, "image_url": "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop"},
    {"name": "Formal White Shirt", "description": "Crisp cotton formal shirt with spread collar, ideal for office and events.", "category": "Men's Clothing", "price": 1299, "stock": 70, "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=300&fit=crop"},

    # ──── Women's Clothing ────
    {"name": "Floral Maxi Dress", "description": "Elegant floral print maxi dress with V-neck and flowy silhouette.", "category": "Women's Dresses", "price": 2299, "stock": 40, "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop"},
    {"name": "Banarasi Silk Saree", "description": "Handwoven Banarasi saree with gold zari work, includes matching blouse piece.", "category": "Women's Sarees", "price": 8999, "stock": 15, "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop"},
    {"name": "Anarkali Suit Set", "description": "Embroidered Anarkali kurta with palazzo pants and dupatta in royal blue.", "category": "Women's Suits", "price": 3499, "stock": 25, "image_url": "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=300&fit=crop"},
    {"name": "High-Waist Mom Jeans", "description": "Relaxed fit high-waist jeans in light wash denim with distressed details.", "category": "Women's Jeans", "price": 1899, "stock": 50, "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=300&fit=crop"},
    {"name": "Crop Top & Skirt Set", "description": "Trendy co-ord set with fitted crop top and pleated midi skirt.", "category": "Women's Dresses", "price": 1599, "stock": 35, "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop"},
    {"name": "Chiffon Party Gown", "description": "Floor-length chiffon gown with sequin embellishments for evening events.", "category": "Women's Dresses", "price": 5999, "stock": 10, "image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop"},

    # ──── Kids Wear ────
    {"name": "Boys Superhero T-Shirt", "description": "100% cotton printed tee with Marvel superhero graphics, ages 4-12.", "category": "Kids Wear", "price": 499, "stock": 80, "image_url": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop"},
    {"name": "Girls Princess Frock", "description": "Sequin-embellished party frock with tulle layers, ages 3-10.", "category": "Kids Wear", "price": 1299, "stock": 45, "image_url": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=300&fit=crop"},
    {"name": "Kids Denim Dungaree", "description": "Unisex denim dungaree with adjustable straps and front pocket.", "category": "Kids Wear", "price": 999, "stock": 55, "image_url": "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=400&h=300&fit=crop"},
    {"name": "Baby Romper Set (3-pack)", "description": "Soft cotton romper set in pastel shades, ages 0-2 years.", "category": "Kids Wear", "price": 799, "stock": 65, "image_url": "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop"},

    # ──── Cosmetics & Beauty ────
    {"name": "MAC Studio Fix Foundation", "description": "Full coverage matte foundation with SPF 15, available in 40+ shades.", "category": "Cosmetics", "price": 3100, "stock": 50, "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop"},
    {"name": "Maybelline Lash Sensational Mascara", "description": "Volumizing mascara with fanning brush for dramatic lashes.", "category": "Cosmetics", "price": 599, "stock": 90, "image_url": "https://images.unsplash.com/photo-1631214500115-598fc2cb389a?w=400&h=300&fit=crop"},
    {"name": "Nykaa Matte Lipstick Set", "description": "Set of 4 ultra-matte liquid lipsticks in trending nude and red shades.", "category": "Cosmetics", "price": 1299, "stock": 60, "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop"},
    {"name": "The Ordinary Niacinamide Serum", "description": "10% Niacinamide + 1% Zinc serum for pore and blemish reduction.", "category": "Cosmetics", "price": 650, "stock": 75, "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop"},
    {"name": "Forest Essentials Kumkumadi Oil", "description": "Ayurvedic night facial oil with saffron for radiant skin.", "category": "Cosmetics", "price": 1750, "stock": 30, "image_url": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop"},
    {"name": "Perfume Gift Set — Luxury Collection", "description": "Curated set of 5 mini luxury perfumes in an elegant gift box.", "category": "Cosmetics", "price": 3999, "stock": 20, "image_url": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop"},

    # ──── Shoes ────
    {"name": "Nike Air Max 270", "description": "Iconic Air Max with 270-degree heel unit for ultimate cushioning.", "category": "Shoes", "price": 12995, "stock": 30, "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"},
    {"name": "Adidas Ultraboost 23", "description": "Premium running shoe with Boost midsole and Primeknit upper.", "category": "Shoes", "price": 16999, "stock": 22, "image_url": "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop"},
    {"name": "Women's Block Heel Sandals", "description": "Elegant suede block heel sandals with ankle strap, in 5 colors.", "category": "Shoes", "price": 2499, "stock": 40, "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=300&fit=crop"},
    {"name": "Men's Formal Leather Oxfords", "description": "Genuine leather oxford shoes with brogue detailing for formal wear.", "category": "Shoes", "price": 4599, "stock": 28, "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=300&fit=crop"},
    {"name": "Kids Velcro Sneakers", "description": "Lightweight sneakers with LED sole lights and easy velcro closure.", "category": "Shoes", "price": 1299, "stock": 50, "image_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=300&fit=crop"},

    # ──── Home & Living ────
    {"name": "Luxury Bed Sheet Set (King)", "description": "400TC Egyptian cotton bed sheet set with 2 pillowcases in ivory.", "category": "Home & Living", "price": 3499, "stock": 25, "image_url": "https://images.unsplash.com/photo-1522771739-9e9611175e6f?w=400&h=300&fit=crop"},
    {"name": "Scented Candle Collection", "description": "Set of 3 soy wax candles — lavender, vanilla, and sandalwood.", "category": "Home & Living", "price": 1299, "stock": 45, "image_url": "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&h=300&fit=crop"},
    {"name": "Boho Macramé Wall Hanging", "description": "Handcrafted cotton macramé wall décor, 36 inches wide.", "category": "Home & Living", "price": 1899, "stock": 20, "image_url": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop"},
    {"name": "Cast Iron Dutch Oven 5L", "description": "Enameled cast iron pot perfect for slow cooking, braising, and baking.", "category": "Home & Living", "price": 4999, "stock": 15, "image_url": "https://images.unsplash.com/photo-1556909114-f6e4b9e4001e?w=400&h=300&fit=crop"},

    # ──── Accessories ────
    {"name": "Ray-Ban Aviator Sunglasses", "description": "Classic gold-frame aviators with polarized green lenses.", "category": "Accessories", "price": 7990, "stock": 35, "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"},
    {"name": "Leather Crossbody Bag", "description": "Genuine leather sling bag with adjustable strap and zip pockets.", "category": "Accessories", "price": 2999, "stock": 40, "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop"},
    {"name": "Fossil Analog Watch", "description": "Classic chronograph watch with leather strap and mineral crystal dial.", "category": "Accessories", "price": 8995, "stock": 18, "image_url": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop"},
    {"name": "Silver Layered Necklace Set", "description": "Sterling silver multi-layer necklace with minimalist pendants.", "category": "Accessories", "price": 1499, "stock": 55, "image_url": "https://images.unsplash.com/photo-1515562141589-67f0d569b3b0?w=400&h=300&fit=crop"},

    # ──── Sports & Fitness ────
    {"name": "Yoga Mat Premium 6mm", "description": "Non-slip TPE yoga mat with alignment lines and carrying strap.", "category": "Sports & Fitness", "price": 1499, "stock": 60, "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop"},
    {"name": "Adjustable Dumbbell Set (20kg)", "description": "Space-saving adjustable dumbbells with quick-lock mechanism.", "category": "Sports & Fitness", "price": 5999, "stock": 15, "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop"},
    {"name": "Running Shorts — Dry Fit", "description": "Lightweight moisture-wicking running shorts with inner brief.", "category": "Sports & Fitness", "price": 799, "stock": 70, "image_url": "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop"},
    {"name": "Resistance Bands Set (5-pack)", "description": "Latex-free resistance bands with 5 levels from light to extra heavy.", "category": "Sports & Fitness", "price": 599, "stock": 85, "image_url": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop"},

    # ──── Books & Stationery ────
    {"name": "Atomic Habits by James Clear", "description": "The #1 bestseller on building good habits and breaking bad ones.", "category": "Books", "price": 399, "stock": 100, "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"},
    {"name": "The Psychology of Money", "description": "Morgan Housel's timeless lessons on wealth, greed, and happiness.", "category": "Books", "price": 349, "stock": 90, "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop"},
    {"name": "Premium Leather Journal", "description": "Handmade A5 leather-bound journal with 200 pages of acid-free paper.", "category": "Books", "price": 899, "stock": 40, "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=300&fit=crop"},
]

def seed():
    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        print(f"📦 Current products in DB: {existing}")

        added = 0
        for p in PRODUCTS:
            # Skip if product with same name exists
            exists = db.query(Product).filter(Product.name == p["name"]).first()
            if exists:
                continue
            product = Product(**p)
            db.add(product)
            added += 1

        db.commit()
        total = db.query(Product).count()
        print(f"✅ Added {added} new products. Total: {total}")

        # Show category breakdown
        from sqlalchemy import func
        cats = db.query(Product.category, func.count(Product.id)).group_by(Product.category).all()
        print("\n📂 Categories:")
        for cat, count in sorted(cats):
            print(f"   {cat}: {count} products")

    finally:
        db.close()

if __name__ == "__main__":
    seed()
