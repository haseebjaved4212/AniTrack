from redis.asyncio import Redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisCache:
    client: Redis = None

    @classmethod
    async def connect(cls):
        try:
            cls.client = Redis.from_url(settings.REDIS_URL, decode_responses=True)
            await cls.client.ping()
            logger.info("Successfully connected to Redis")
        except Exception as e:
            logger.error(f"Error connecting to Redis: {e}")
            cls.client = None

    @classmethod
    async def close(cls):
        if cls.client:
            await cls.client.close()
            logger.info("Closed Redis connection")

redis_cache = RedisCache()
