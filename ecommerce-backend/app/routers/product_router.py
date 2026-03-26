from fastapi import APIRouter, HTTPException, status, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models import Product, User
from app.schemas import ProductCreate, ProductUpdate, ProductResponse
from app.dependencies import get_current_user, require_admin
from app.cache import get_cache, set_cache, invalidate_product_cache

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductResponse])
def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    # Build cache key
    cache_key = f"products:skip={skip}:limit={limit}:search={search}:cat={category}:min={min_price}:max={max_price}"
    cached = get_cache(cache_key)
    if cached:
        return cached

    query = db.query(Product)

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(Product.category == category)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    products = query.order_by(Product.id).offset(skip).limit(limit).all()

    # Serialize for cache
    result = [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "category": p.category,
            "price": p.price,
            "stock": p.stock,
            "image_url": p.image_url,
        }
        for p in products
    ]
    set_cache(cache_key, result)

    return products


@router.get("/categories", response_model=list[str])
def get_categories(db: Session = Depends(get_db)):
    cached = get_cache("products:categories")
    if cached:
        return cached

    categories = db.query(Product.category).distinct().all()
    result = sorted([c[0] for c in categories if c[0]])
    set_cache("products:categories", result)
    return result


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    cached = get_cache(f"product:{product_id}")
    if cached:
        return cached

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    result = {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "category": product.category,
        "price": product.price,
        "stock": product.stock,
        "image_url": product.image_url,
    }
    set_cache(f"product:{product_id}", result)

    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product: ProductCreate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    new_product = Product(
        name=product.name,
        description=product.description,
        category=product.category,
        price=product.price,
        stock=product.stock,
        image_url=product.image_url,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    invalidate_product_cache()
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    update_dict = product_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    invalidate_product_cache()
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    admin_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    invalidate_product_cache()
