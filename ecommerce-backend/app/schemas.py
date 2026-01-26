from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
class UserLogin(BaseModel):
    email: EmailStr
    password: str
class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
class CartAdd(BaseModel):
    product_id: int
    quantity: int
class CartItemResponse(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int
class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total: float
