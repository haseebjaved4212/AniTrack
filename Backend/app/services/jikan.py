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
            elif response.status_code in [429, 500, 502, 503, 504]:
                logger.warning(f"Jikan API error {response.status_code}. Retrying in {attempt + 1} seconds...")
                await asyncio.sleep(attempt + 1)
            else:
                response.raise_for_status()
                
        # Instead of crashing the backend on rate limit, log it and return empty data
        logger.error("Failed to fetch from Jikan API after multiple retries due to rate limits")
        return {"data": [], "pagination": {"last_visible_page": 1, "has_next_page": False, "current_page": 1, "items": {"count": 0, "total": 0, "per_page": 10}}}

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

async def search_anime(query: str, page: int = 1) -> AnimeSearchResponse:
    cache_key = f"anime:search:{query.lower()}:page:{page}"
    
    if redis_cache.client:
        cached_data = await redis_cache.client.get(cache_key)
        if cached_data:
            return AnimeSearchResponse(**json.loads(cached_data))

    url = f"{settings.JIKAN_API_BASE_URL}/anime"
    params = {"q": query, "limit": 10, "page": page}
    
    data = await _fetch_with_retries(url, params=params)
    
    transformed_data = {
        "pagination": data.get("pagination"),
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
    
    # In case of rate limit mock data, data.get("data") is an empty list
    jikan_data = data.get("data", {})
    if isinstance(jikan_data, list):
        if not jikan_data:
            # If rate limited, just return a mock anime so the page doesn't crash
            mock_anime = {
                "mal_id": mal_id,
                "title": "Unknown Anime (Rate Limited)",
                "synopsis": "Jikan API rate limit exceeded.",
                "image_url": None,
                "episodes": 0,
                "status": "Unknown",
                "score": 0.0
            }
            return AnimeJikanResponse(data=mock_anime)
        jikan_data = jikan_data[0]
        
    transformed_data = {
        "data": _transform_jikan_anime(jikan_data)
    }
    
    if redis_cache.client:
        await redis_cache.client.setex(cache_key, 86400, json.dumps(transformed_data)) # Cache for 24 hours
        
    return AnimeJikanResponse(**transformed_data)
