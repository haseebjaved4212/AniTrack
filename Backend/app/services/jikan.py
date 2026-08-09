from curl_cffi import requests as curl_requests
from curl_cffi.requests.exceptions import RequestsError
import asyncio
import json
import logging
from functools import partial
from typing import Optional
from fastapi import HTTPException

from app.core.config import settings
from app.db.redis import redis_cache
from app.schemas.anime import AnimeSearchResponse, AnimeJikanResponse

logger = logging.getLogger(__name__)

def _sync_jikan_get(url: str, params: dict = None):
    """Blocking curl_cffi call — run in a thread pool from the async caller.

    curl_cffi's sync client reliably impersonates Chrome's TLS fingerprint
    and gets a clean 200 from Jikan. The AsyncSession variant was tested and
    consistently returned 504s when called from inside FastAPI/uvicorn's
    event loop (worked fine in a standalone asyncio.run() script), so we
    sidestep that by using the proven sync client off the event loop thread.
    """
    return curl_requests.get(
        url,
        params=params,
        timeout=10.0,
        impersonate="chrome"
    )

async def _fetch_with_retries(url: str, params: dict = None, retries: int = 3) -> dict:
    """Helper to fetch from Jikan with rate limit handling.

    Uses curl_cffi (impersonating Chrome's TLS fingerprint) instead of httpx,
    since Jikan's edge protection silently rejects Python's default TLS
    handshake with a fast fake 504 — see debugging notes in PR/commit history.
    """
    loop = asyncio.get_running_loop()

    for attempt in range(retries):
        try:
            response = await loop.run_in_executor(
                None, partial(_sync_jikan_get, url, params)
            )
            logger.warning(f"Jikan responded with status {response.status_code}")

            if response.status_code == 200:
                return response.json()
            elif response.status_code in [429, 500, 502, 503, 504]:
                logger.warning(f"Jikan API error {response.status_code}. Retrying in {attempt + 1} seconds...")
                await asyncio.sleep(attempt + 1)
            else:
                response.raise_for_status()

        except RequestsError as e:
            logger.warning(f"Connection error/timeout on attempt {attempt + 1}: {str(e)}. Retrying in {attempt + 1} seconds...")
            await asyncio.sleep(attempt + 1)
        except json.JSONDecodeError as e:
            logger.warning(f"JSON decode error on attempt {attempt + 1}: {str(e)}. Retrying in {attempt + 1} seconds...")
            await asyncio.sleep(attempt + 1)

    logger.error(f"Failed to fetch from Jikan API after {retries} retries due to timeouts, rate limits, or errors.")
    raise HTTPException(status_code=503, detail="Anime data source temporarily unavailable. Please try again later.")

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

    jikan_data = data.get("data", {})
    if isinstance(jikan_data, list) and jikan_data:
        jikan_data = jikan_data[0]

    transformed_data = {
        "data": _transform_jikan_anime(jikan_data)
    }

    if redis_cache.client:
        await redis_cache.client.setex(cache_key, 86400, json.dumps(transformed_data)) # Cache for 24 hours

    return AnimeJikanResponse(**transformed_data)