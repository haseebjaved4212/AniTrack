from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AnimeBase(BaseModel):
    id: int
    title: str
    image_url: Optional[str] = None
    episodes: Optional[int] = None
    status: Optional[str] = None
    score: Optional[float] = None

    class Config:
        from_attributes = True

class EntryCreate(BaseModel):
    status: str = Field(default="Plan to Watch", description="Watching, Completed, Plan to Watch, Dropped, On Hold")
    rating: Optional[int] = Field(default=None, ge=1, le=10)
    progress: int = Field(default=0, ge=0)
    notes: Optional[str] = None

class EntryUpdate(BaseModel):
    status: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=10)
    progress: Optional[int] = Field(default=None, ge=0)
    notes: Optional[str] = None

class EntryResponse(BaseModel):
    id: int
    user_id: int
    anime_id: int
    status: str
    rating: Optional[int]
    progress: int
    notes: Optional[str]
    updated_at: datetime
    anime: AnimeBase

    class Config:
        from_attributes = True
