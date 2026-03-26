# Backend Architecture — Scalable E-Commerce Platform

## Overview

RESTful API built with **FastAPI** (Python), using **PostgreSQL** for storage, **Redis** for caching, and **JWT** for authentication. Modular router-based architecture with role-based access control.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT (React / Swagger)                │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP (JSON)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    FASTAPI APP (main.py)                  │
│  CORS Middleware → Router Registration → Health Check     │
│  /auth  /products  /cart  /orders  /                      │
└────────────────────────┬────────────────────────────────┘
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
   dependencies.py    auth.py       cache.py
   (JWT guards)     (bcrypt/JWT)   (Redis TTL)
          │                            │
          ▼                            ▼
     database.py                  Redis 7 (:6379)
     (SQLAlchemy)                 (optional)
          │
          ▼
     PostgreSQL 16 (:5432)
     53 products, 6 tables, indexed
```

---

## Database — 6 Tables, 14 Categories

```
Users ──→ Carts ──→ CartItems ──→ Products
  │                                  ↑
  └──→ Orders ──→ OrderItems ────────┘
```

**53 seeded products** across: Electronics, Men's Clothing, Women's Dresses/Sarees/Suits/Jeans, Kids Wear, Cosmetics, Shoes, Home & Living, Accessories, Sports & Fitness, Books, General.

### Performance Indexes
| Index | Columns | Purpose |
|-------|---------|---------|
| `ix_users_email` | email (unique) | Login lookup |
| `ix_products_category_price` | category, price | Filter queries |
| `ix_orders_user_created` | user_id, created_at | Order history |
| `ix_cart_items_cart_product` | cart_id, product_id | Cart uniqueness |

---

## Authentication Flow

```
POST /auth/login {email, password}
  → bcrypt.verify → jwt.encode({sub: email, role})
  → {access_token, bearer}

GET /products (Authorization: Bearer <token>)
  → jwt.decode → db.query(User) → inject via Depends()
```

- Passwords: **bcrypt** (passlib)
- Tokens: **JWT** (python-jose), 30-min expiry
- Guards: `get_current_user()`, `require_admin()`

---

## Routers (17 endpoints)

| Router | Endpoints | Key Features |
|--------|-----------|-------------|
| `/auth` | signup, login, /me | JWT + role in token |
| `/products` | CRUD + search/filter | Redis cached, admin-only write |
| `/cart` | add, update, remove, view | Returns full cart on every mutation |
| `/orders` | place, list, detail | DB transaction with stock deduction |

---

## Redis Caching

**Strategy:** Cache-aside with 5-min TTL. All product endpoints cached. Write operations (POST/PUT/DELETE) invalidate `products:*` keys.

**Graceful fallback:** If Redis unavailable, `REDIS_AVAILABLE = False` and all cache functions become no-ops. App works normally without caching.

---

## Docker

```yaml
services:
  db:       PostgreSQL 16 (:5432) + healthcheck
  redis:    Redis 7 (:6379) + healthcheck
  backend:  Python 3.13 (:8000) depends_on: [db, redis]
  frontend: Node 20 (:5173) depends_on: [backend]
```

Startup order enforced via health checks: **PostgreSQL → Redis → Backend → Frontend**

---

## Security
- bcrypt password hashing (never plaintext)
- JWT 30-min expiry
- Secrets in `.env` (gitignored)
- CORS restricted to frontend origin
- SQLAlchemy parameterized queries (SQL injection safe)
- Role-based admin route protection
