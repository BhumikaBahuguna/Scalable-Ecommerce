from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ──── Auth Schemas ────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ──── Product Schemas ────

class ProductCreate(BaseModel):
    name: str
    description: str = ""
    category: str = "general"
    price: float
    stock: int
    image_url: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: str
    price: float
    stock: int
    image_url: Optional[str]

    class Config:
        from_attributes = True


# ──── Cart Schemas ────

class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdate(BaseModel):
    quantity: int


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    name: str
    price: float
    quantity: int
    subtotal: float


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total_amount: float


# ──── Order Schemas ────

class OrderItemResponse(BaseModel):
    product_id: int
    name: str
    quantity: int
    price: float
    subtotal: float


class OrderResponse(BaseModel):
    order_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: list[OrderItemResponse]


class OrderPlacedResponse(BaseModel):
    message: str
    order_id: int
    total_amount: float
