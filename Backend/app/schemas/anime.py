from pydantic import BaseModel
from typing import Optional, List

class AnimeJikanBase(BaseModel):
    mal_id: int
    title: str
    synopsis: Optional[str] = None
    image_url: Optional[str] = None
    episodes: Optional[int] = None
    status: Optional[str] = None
    score: Optional[float] = None

class AnimeJikanResponse(BaseModel):
    data: AnimeJikanBase

class JikanPagination(BaseModel):
    last_visible_page: int
    has_next_page: bool
    current_page: int
    items: dict

class AnimeSearchResponse(BaseModel):
    pagination: Optional[JikanPagination] = None
    data: List[AnimeJikanBase]
