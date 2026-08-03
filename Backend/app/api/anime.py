from fastapi import APIRouter, Query, Path
from typing import Any

from app.schemas.anime import AnimeSearchResponse, AnimeJikanResponse
from app.services import jikan

router = APIRouter()

@router.get("/search", response_model=AnimeSearchResponse)
async def search_anime(
    q: str = Query(..., min_length=3, description="Search query for anime")
) -> Any:
    """
    Search for anime using the Jikan API. Results are cached in Redis.
    """
    return await jikan.search_anime(q)

@router.get("/{id}", response_model=AnimeJikanResponse)
async def get_anime(
    id: int = Path(..., description="The MyAnimeList ID of the anime")
) -> Any:
    """
    Get specific anime details using the Jikan API. Results are cached in Redis.
    """
    return await jikan.get_anime_by_id(id)
