from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth_router, product_router, cart_router, order_router
from app.cache import REDIS_AVAILABLE

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Scalable E-Commerce API",
    description="A production-grade e-commerce backend with JWT auth, Redis caching, and PostgreSQL",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router.router)
app.include_router(product_router.router)
app.include_router(cart_router.router)
app.include_router(order_router.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "Scalable E-Commerce API",
        "redis_connected": REDIS_AVAILABLE,
    }
