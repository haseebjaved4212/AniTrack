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

class AnimeSearchResponse(BaseModel):
    data: List[AnimeJikanBase]
