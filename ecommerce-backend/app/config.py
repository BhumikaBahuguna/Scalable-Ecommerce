from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    SECRET_KEY: str = "supersecretkey-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    DATABASE_URL: str = "postgresql://postgres:Satyam%404050@localhost:5432/ecommerce_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
