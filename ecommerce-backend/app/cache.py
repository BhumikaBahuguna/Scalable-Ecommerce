import redis
import json
from app.config import get_settings

settings = get_settings()

try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    redis_client.ping()
    REDIS_AVAILABLE = True
except (redis.ConnectionError, redis.TimeoutError):
    redis_client = None
    REDIS_AVAILABLE = False


CACHE_TTL = 300  # 5 minutes


def get_cache(key: str):
    if not REDIS_AVAILABLE:
        return None
    try:
        data = redis_client.get(key)
        return json.loads(data) if data else None
    except Exception:
        return None


def set_cache(key: str, value, ttl: int = CACHE_TTL):
    if not REDIS_AVAILABLE:
        return
    try:
        redis_client.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass


def delete_cache(key: str):
    if not REDIS_AVAILABLE:
        return
    try:
        redis_client.delete(key)
    except Exception:
        pass


def invalidate_product_cache():
    """Invalidate all product-related caches."""
    if not REDIS_AVAILABLE:
        return
    try:
        keys = redis_client.keys("products:*")
        if keys:
            redis_client.delete(*keys)
        # Also invalidate single product caches
        keys = redis_client.keys("product:*")
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass
