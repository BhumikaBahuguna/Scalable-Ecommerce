from fastapi import FastAPI
from app.database import SessionLocal
from app.models import Product
from fastapi import FastAPI, HTTPException
from app.database import SessionLocal
from app.models import User, Product
from app.auth import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user
from fastapi import Depends, Header
from app.auth import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()
from app.dependencies import get_current_user, require_admin
from app.schemas import ProductCreate
from app.models import Cart, CartItem, Product
from app.schemas import CartAdd
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Cart, CartItem, Product
from app.auth import get_current_user
from app.models import User
from sqlalchemy.exc import SQLAlchemyError
from app.models import Order, OrderItem, Cart, CartItem, Product
from fastapi.middleware.cors import CORSMiddleware



def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials  # this extracts the JWT only

    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    db = SessionLocal()
    user = db.query(User).filter(User.email == payload.get("sub")).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/products")
def get_products(
    skip: int = 0,
    limit: int = 10,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    products = (
    db.query(Product)
    .order_by(Product.id)
    .offset(skip)
    .limit(limit)
    .all()
)
    return products




from app.schemas import UserCreate

@app.post("/signup")
def signup(user: UserCreate):
    db = SessionLocal()

    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {"message": "User created successfully"}

from app.schemas import UserLogin

@app.post("/login")
def login(user: UserLogin):
    db = SessionLocal()

    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer"
    }


@app.post("/products")
def create_product(
    product: ProductCreate,
    admin_user: User = Depends(require_admin)
):
    db = SessionLocal()

    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        stock=product.stock
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@app.post("/cart/add")
def add_to_cart(
    data: CartAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
   
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    cart_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product.id
    ).first()

    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=data.quantity
        )
        db.add(cart_item)

    db.commit()

    return {"message": "Product added to cart"}

@app.get("/cart")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()

    if not cart:
        return {
            "items": [],
            "total_amount": 0
        }

    cart_items = (
        db.query(CartItem, Product)
        .join(Product, CartItem.product_id == Product.id)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    items = []
    total_amount = 0

    for cart_item, product in cart_items:
        item_total = product.price * cart_item.quantity
        total_amount += item_total

        items.append({
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": cart_item.quantity
        })

    return {
        "items": items,
        "total_amount": total_amount
    }

@app.post("/orders/place")
def place_order(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()

    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")

    cart_items = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    try:
        total_amount = 0

        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Not enough stock for {product.name}"
                )

            total_amount += product.price * item.quantity

      
        order = Order(
            user_id=current_user.id,
            total_amount=total_amount,
            status="PLACED"
        )
        db.add(order)
        db.flush()  


        for item in cart_items:
            product = db.query(Product).filter(Product.id == item.product_id).first()

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )

            product.stock -= item.quantity

            db.add(order_item)

        db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()

        db.commit()

        return {
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_amount": total_amount
        }

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Order failed")
    
@app.get("/orders")
def get_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
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
            items.append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price
            })

        result.append({
            "order_id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at,
            "items": items
        })

    return result

