# Frontend Architecture — Scalable E-Commerce Platform

## Overview

**React 19 SPA** with **TypeScript**, **Tailwind CSS v4**, **Vite 7**. Uses **Zustand** (4 stores), **React Router v6**, **React Hook Form + Zod**, and **Framer Motion**. Marketplace-level UI with dark/light mode.

---

## Architecture

```
┌─────────────── BrowserRouter ───────────────┐
│                                              │
│  AuthLayout (/login, /signup)                │
│  MainLayout (Navbar → Outlet → Footer)       │
│                                              │
│  ┌─ Zustand ─┐  ┌─ Axios ─────────────┐     │
│  │ authStore  │  │ JWT auto-attach      │     │
│  │ cartStore  │  │ 401 auto-redirect    │     │
│  │ prodStore  │  └─────────┬───────────┘     │
│  │ themeStore │            │ HTTP             │
│  └────────────┘            ▼                 │
│                     FastAPI :8000             │
└──────────────────────────────────────────────┘
```

---

## Folder Structure

```
src/
├── api/api.ts              # Axios + interceptors
├── types/index.ts           # All TypeScript interfaces
├── utils/product.ts         # Image fallbacks, ratings, icons
├── store/
│   ├── authStore.ts         # login, signup, logout, fetchUser
│   ├── cartStore.ts         # add, update, remove, fetchCart
│   ├── productStore.ts      # fetch, filter, paginate, sort
│   └── themeStore.ts        # dark/light toggle, localStorage
├── layouts/
│   ├── MainLayout.tsx       # Navbar + Footer + Toast
│   └── AuthLayout.tsx       # Gradient BG + glass card
├── components/
│   ├── Navbar.tsx           # Sticky, theme toggle, categories dropdown
│   ├── ProductCard.tsx      # Images, ratings, discounts, hover zoom
│   ├── StarRating.tsx       # Filled/half/empty star display
│   ├── ThemeToggle.tsx      # Animated dark/light switch
│   └── ProtectedRoute.tsx   # Auth + admin guard
├── pages/
│   ├── Login.tsx / Signup.tsx
│   ├── Products.tsx         # Sidebar, search, filters, sorting
│   ├── ProductDetail.tsx    # Image, trust signals, related products
│   ├── Cart.tsx             # Product images, animated removals
│   ├── Orders.tsx           # Expandable order cards
│   ├── Profile.tsx          # User info cards
│   └── AdminDashboard.tsx   # CRUD table + modal form
├── index.css                # Tailwind + CSS variables design system
├── App.tsx                  # Router + theme initialization
└── main.tsx                 # Entry point
```

---

## Routing

```
AuthLayout (redirects if authenticated)
├── /login       → LoginPage
└── /signup      → SignupPage

MainLayout (Navbar + Footer)
├── /             → Redirect → /products
├── /products     → ProductsPage (public)
├── /products/:id → ProductDetailPage (public)
├── 🔒 /cart      → CartPage
├── 🔒 /orders    → OrdersPage
├── 🔒 /profile   → ProfilePage
├── 🔐 /admin     → AdminDashboard (admin only)
└── /*            → Redirect → /products
```

---

## Design System (CSS Variables)

**Dark/Light mode** via CSS custom properties on `:root` / `html.light`.

| Token | Dark | Light |
|-------|------|-------|
| `--bg-primary` | `#09090b` | `#f8fafc` |
| `--bg-card` | `rgba(26,26,46,0.7)` | `rgba(255,255,255,0.85)` |
| `--text-primary` | `#f1f5f9` | `#0f172a` |
| `--border-subtle` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |

**Brand palette:** Indigo-500 → Purple-700 gradient. Accent: Emerald-500.

**Utilities:** `.glass`, `.gradient-text`, `.gradient-bg`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input-field`, `.skeleton`, `.badge-*`, `.cat-item`, `.img-zoom`, `.price-original`

---

## Key UI Features

| Feature | Implementation |
|---------|---------------|
| **Product images** | Unsplash URLs in DB, per-category fallbacks in `utils/product.ts` |
| **Star ratings** | Deterministic per product ID via `generateRating()` |
| **Discount badges** | Gradient badge + strikethrough original price |
| **Hover zoom** | `.img-zoom` CSS class + group hover |
| **Category sidebar** | Amazon-style with emoji icons, active state |
| **Sorting** | Client-side: price asc/desc, newest |
| **Quick price ranges** | Under ₹500, ₹500–₹2K, ₹2K–₹10K, ₹10K+ |
| **Trust signals** | Free Delivery, Secure Payment, 7-Day Return |
| **Related products** | Same-category products on detail page |
| **Cart animations** | Framer Motion exit animations on remove |
| **Theme toggle** | Animated icon rotation, persisted in localStorage |

---

## Performance

| Technique | Implementation |
|-----------|---------------|
| Debounced search | 400ms delay |
| Skeleton loaders | Every page has shimmer loading state |
| Lazy images | `loading="lazy"` on all product images |
| Zustand selectors | Minimal re-renders |
| Vite | Fast HMR, tree-shaking |
| Layout routes | Shared Navbar avoids re-mount |
