from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.database import get_db
from app.models import Order, OrderItem, Cart, CartItem, Product, User
from app.schemas import OrderResponse, OrderItemResponse, OrderPlacedResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/place", response_model=OrderPlacedResponse)
def place_order(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    cart_items = db.query(CartItem).filter(CartItem.cart_id == cart.id).all()
    if not cart_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cart is empty",
        )

    try:
        total_amount = 0

        # Validate stock for all items first
        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product ID {item.product_id} no longer exists",
                )
            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Not enough stock for {product.name} (available: {product.stock})",
                )
            total_amount += product.price * item.quantity

        # Create order
        order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            status="PLACED",
        )
        db.add(order)
        db.flush()

        # Create order items and deduct stock
        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
            )
            db.add(order_item)
            product.stock -= item.quantity

        # Clear cart
        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        db.commit()

        return {
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_amount": total_amount,
        }

    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Order failed due to a server error",
        )


@router.get("", response_model=list[OrderResponse])
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    result = []
    for order in orders:
        items = []
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            items.append({
                "product_id": item.product_id,
                "name": product.name if product else "Deleted Product",
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.price * item.quantity,
            })

        result.append({
            "order_id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "items": items,
        })

    return result


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    items = []
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items.append({
            "product_id": item.product_id,
            "name": product.name if product else "Deleted Product",
            "quantity": item.quantity,
            "price": item.price,
            "subtotal": item.price * item.quantity,
        })

    return {
        "order_id": order.id,
        "total_amount": order.total_amount,
        "status": order.status,
        "created_at": order.created_at,
        "items": items,
    }
