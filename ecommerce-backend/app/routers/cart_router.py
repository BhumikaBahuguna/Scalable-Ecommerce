from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Cart, CartItem, Product, User
from app.schemas import CartAdd, CartUpdate, CartItemResponse, CartResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


def _get_or_create_cart(user_id: int, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def _build_cart_response(cart: Cart, db: Session) -> dict:
    cart_items = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    items = []
    total_amount = 0

    for cart_item, product in cart_items:
        subtotal = product.price * cart_item.quantity
        total_amount += subtotal
        items.append({
            "id": cart_item.id,
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": cart_item.quantity,
            "subtotal": subtotal,
        })

    return {"items": items, "total_amount": total_amount}


@router.get("", response_model=CartResponse)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        return {"items": [], "total_amount": 0}

    return _build_cart_response(cart, db)


@router.post("/add", response_model=CartResponse)
def add_to_cart(
    data: CartAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if product.stock < data.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Only {product.stock} units available",
        )

    cart = _get_or_create_cart(current_user.id, db)

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id)
        .first()
    )

    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=data.quantity,
        )
        db.add(cart_item)

    db.commit()

    return _build_cart_response(cart, db)


@router.put("/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: int,
    data: CartUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    if data.quantity <= 0:
        db.delete(cart_item)
    else:
        product = db.query(Product).filter(Product.id == cart_item.product_id).first()
        if product and data.quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only {product.stock} units available",
            )
        cart_item.quantity = data.quantity

    db.commit()

    return _build_cart_response(cart, db)


@router.delete("/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart not found",
        )

    cart_item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.cart_id == cart.id)
        .first()
    )
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    db.delete(cart_item)
    db.commit()

    return _build_cart_response(cart, db)
