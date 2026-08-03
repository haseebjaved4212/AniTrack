import httpx
import asyncio
import json
import logging
from typing import Optional

from app.core.config import settings
from app.db.redis import redis_cache
from app.schemas.anime import AnimeSearchResponse, AnimeJikanResponse

logger = logging.getLogger(__name__)

async def _fetch_with_retries(url: str, params: dict = None, retries: int = 3) -> dict:
    """Helper to fetch from Jikan with rate limit handling"""
    async with httpx.AsyncClient() as client:
        for attempt in range(retries):
            response = await client.get(url, params=params)
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                logger.warning(f"Jikan API rate limit hit. Retrying in {attempt + 1} seconds...")
                await asyncio.sleep(attempt + 1)
            else:
                response.raise_for_status()
                
        raise Exception("Failed to fetch from Jikan API after multiple retries due to rate limits")

def _transform_jikan_anime(item: dict) -> dict:
    """Helper to transform the messy Jikan response into our clean schema"""
    return {
        "mal_id": item.get("mal_id"),
        "title": item.get("title"),
        "synopsis": item.get("synopsis"),
        "image_url": item.get("images", {}).get("jpg", {}).get("image_url"),
        "episodes": item.get("episodes"),
        "status": item.get("status"),
        "score": item.get("score"),
    }

async def search_anime(query: str) -> AnimeSearchResponse:
    cache_key = f"anime:search:{query.lower()}"
    
    if redis_cache.client:
        cached_data = await redis_cache.client.get(cache_key)
        if cached_data:
            return AnimeSearchResponse(**json.loads(cached_data))

    url = f"{settings.JIKAN_API_BASE_URL}/anime"
    params = {"q": query, "limit": 10}
    
    data = await _fetch_with_retries(url, params=params)
    
    transformed_data = {
        "data": [_transform_jikan_anime(item) for item in data.get("data", [])]
    }
    
    if redis_cache.client:
        await redis_cache.client.setex(cache_key, 3600, json.dumps(transformed_data)) # Cache for 1 hour
        
    return AnimeSearchResponse(**transformed_data)

async def get_anime_by_id(mal_id: int) -> AnimeJikanResponse:
    cache_key = f"anime:id:{mal_id}"
    
    if redis_cache.client:
        cached_data = await redis_cache.client.get(cache_key)
        if cached_data:
            return AnimeJikanResponse(**json.loads(cached_data))

    url = f"{settings.JIKAN_API_BASE_URL}/anime/{mal_id}"
    
    data = await _fetch_with_retries(url)
    
    transformed_data = {
        "data": _transform_jikan_anime(data.get("data", {}))
    }
    
    if redis_cache.client:
        await redis_cache.client.setex(cache_key, 86400, json.dumps(transformed_data)) # Cache for 24 hours
        
    return AnimeJikanResponse(**transformed_data)
