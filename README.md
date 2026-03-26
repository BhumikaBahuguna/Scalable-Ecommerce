# 🛒 ShopScale — Scalable E-Commerce Platform

A full-stack, production-grade e-commerce marketplace built with **FastAPI**, **PostgreSQL**, **Redis**, and **React** — featuring 53+ products across 14 categories, dark/light mode, and premium SaaS-level UI.

---

## 🚀 Tech Stack

| Layer            | Technology                                          |
| ---------------- | --------------------------------------------------- |
| **Frontend**     | React 19, TypeScript, Vite 7, Tailwind CSS v4       |
| **State**        | Zustand, React Hook Form + Zod                      |
| **UI/UX**        | Framer Motion, Lucide Icons, React Hot Toast         |
| **Backend**      | FastAPI, SQLAlchemy, Pydantic v2                     |
| **Database**     | PostgreSQL 16 (53+ products seeded)                  |
| **Caching**      | Redis 7 (graceful fallback)                          |
| **Auth**         | JWT (python-jose), bcrypt (passlib)                  |
| **DevOps**       | Docker, Docker Compose                               |

---

## 📸 Features

### 🌗 Dark + Light Mode
Toggle between dark and light themes — persisted in localStorage.

### 🛍️ Marketplace Product Catalog
- **53 products** across **14 categories**: Electronics, Men's Clothing, Women's Dresses/Sarees/Suits/Jeans, Kids Wear, Cosmetics, Shoes, Home & Living, Accessories, Sports & Fitness, Books
- Each product has a unique high-quality image
- Star ratings and discount badges
- Image hover zoom with quick-action overlay

### 📂 Category System
- Amazon-style sidebar with category icons
- Navbar category dropdown
- URL-based category navigation (`/products?category=Electronics`)

### 🔍 Search & Filtering
- Debounced search input
- Category, price range (with quick presets: Under ₹500, ₹500–₹2K, etc.)
- Sorting: Price Low→High, High→Low, Newest

### 🛒 Cart & Orders
- Product images in cart items
- Animated item add/remove
- Sticky order summary with trust signals
- Order history with expandable item details

### 🔐 Auth & Admin
- JWT-based signup/login with Zod validation
- Role-based access (user/admin)
- Admin dashboard: full product CRUD with modal form

---

## 📁 Project Structure

```
Scalable-Ecommerce/
├── docker-compose.yml
├── backend_architecture.md
├── frontend_architecture.md
│
├── ecommerce-backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── seed_products.py          # 53 products seed script
│   ├── .env
│   └── app/
│       ├── main.py               # App hub + routers
│       ├── config.py             # Environment config
│       ├── database.py           # SQLAlchemy engine
│       ├── models.py             # 6 ORM models (indexed)
│       ├── schemas.py            # Pydantic schemas
│       ├── auth.py               # JWT + bcrypt
│       ├── dependencies.py       # Auth guards
│       ├── cache.py              # Redis caching
│       └── routers/
│           ├── auth_router.py
│           ├── product_router.py
│           ├── cart_router.py
│           └── order_router.py
│
├── ecommerce-frontend/
│   ├── Dockerfile
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── api/api.ts            # Axios + interceptors
│       ├── store/                # Zustand (auth, cart, products, theme)
│       ├── types/index.ts        # TypeScript interfaces
│       ├── utils/product.ts      # Image fallbacks, ratings, icons
│       ├── layouts/              # MainLayout, AuthLayout
│       ├── components/           # Navbar, ProductCard, ThemeToggle, etc.
│       ├── pages/                # 8 pages
│       ├── index.css             # Tailwind + design system
│       ├── App.tsx               # Router config
│       └── main.tsx              # Entry point
│
└── README.md
```

---

## 🔌 API Endpoints (17 total)

### Auth (`/auth`)
| Method | Endpoint        | Auth   | Description               |
| ------ | --------------- | ------ | ------------------------- |
| POST   | `/auth/signup`  | Public | Register user             |
| POST   | `/auth/login`   | Public | Login → JWT token         |
| GET    | `/auth/me`      | User   | Current user profile      |

### Products (`/products`)
| Method | Endpoint               | Auth  | Description                          |
| ------ | ---------------------- | ----- | ------------------------------------ |
| GET    | `/products`            | Public | List (search, filter, paginate)     |
| GET    | `/products/categories` | Public | All categories                      |
| GET    | `/products/{id}`       | Public | Product detail                      |
| POST   | `/products`            | Admin  | Create product                      |
| PUT    | `/products/{id}`       | Admin  | Update product                      |
| DELETE | `/products/{id}`       | Admin  | Delete product                      |

### Cart (`/cart`)
| Method | Endpoint          | Auth | Description          |
| ------ | ----------------- | ---- | -------------------- |
| GET    | `/cart`           | User | View cart            |
| POST   | `/cart/add`       | User | Add to cart          |
| PUT    | `/cart/{item_id}` | User | Update quantity      |
| DELETE | `/cart/{item_id}` | User | Remove item          |

### Orders (`/orders`)
| Method | Endpoint        | Auth | Description          |
| ------ | --------------- | ---- | -------------------- |
| POST   | `/orders/place` | User | Place order          |
| GET    | `/orders`       | User | Order history        |
| GET    | `/orders/{id}`  | User | Order detail         |

---

## 🖥️ Frontend Pages

| Page             | Route            | Features                                          |
| ---------------- | ---------------- | ------------------------------------------------- |
| Login            | `/login`         | Zod validation, animated, toast feedback           |
| Signup           | `/signup`        | Password confirm, auto-redirect                    |
| Products         | `/products`      | Sidebar, search, filters, sorting, skeleton loaders|
| Product Detail   | `/products/:id`  | Image, ratings, trust signals, related products    |
| Cart             | `/cart`          | Product images, qty controls, sticky summary       |
| Orders           | `/orders`        | Expandable cards, status badges, timestamps        |
| Profile          | `/profile`       | User info with glassmorphism cards                  |
| Admin Dashboard  | `/admin`         | Product CRUD table + modal form (admin only)       |

---

## 📂 Product Categories (14)

| Icon | Category | Products |
|------|----------|----------|
| 💻 | Electronics | 8 |
| 👔 | Men's Clothing | 5 |
| 👗 | Women's Dresses | 3 |
| 🥻 | Women's Sarees | 1 |
| 👘 | Women's Suits | 1 |
| 👖 | Women's Jeans | 1 |
| 🧒 | Kids Wear | 4 |
| 💄 | Cosmetics | 6 |
| 👟 | Shoes | 5 |
| 🏠 | Home & Living | 4 |
| ⌚ | Accessories | 4 |
| 🏋️ | Sports & Fitness | 4 |
| 📚 | Books | 3 |
| 📦 | General | 4 |

---

## 🛠️ How to Run

### Option 1: Docker
```bash
docker-compose up --build
```

### Option 2: Local Development

#### Backend
```bash
cd ecommerce-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python seed_products.py              # Seed 53 products (run once)
python -m uvicorn app.main:app --reload
```
→ **http://localhost:8000** (Swagger: **http://localhost:8000/docs**)

#### Frontend
```bash
cd ecommerce-frontend
npm install
npm run dev
```
→ **http://localhost:5173**

---

## 📤 Push to GitHub
```bash
git add .
git commit -m "feat: marketplace UI with 53 products, dark/light mode, categories"
git push origin main
```

---

## ⚡ Key Architecture Highlights

- **Modular Backend** — 4 routers, Redis cache-aside with graceful fallback
- **Zustand Stores** — auth, cart, products, theme (minimal re-renders)
- **Axios Interceptors** — auto JWT attach + 401 redirect
- **CSS Variables** — seamless dark/light mode via theme tokens
- **DB Indexing** — composite indexes on products, orders, cart items
- **Docker Ready** — one-command deployment with health checks
