from fastapi import APIRouter, Depends, Query, Path, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api import deps
from app.models.user import User
from app.schemas.entry import EntryCreate, EntryUpdate, EntryResponse
from app.services import entry as entry_service

router = APIRouter()

@router.post("/{mal_id}", response_model=EntryResponse, status_code=status.HTTP_201_CREATED)
async def add_entry(
    entry_in: EntryCreate,
    mal_id: int = Path(..., description="The MyAnimeList ID of the anime"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Add an anime to the current user's list.
    """
    return await entry_service.add_anime_entry(db, user_id=current_user.id, mal_id=mal_id, entry_in=entry_in)

@router.get("", response_model=List[EntryResponse])
async def get_entries(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (Watching, Completed, etc.)"),
    skip: int = Query(0, ge=0, description="Skip entries for pagination"),
    limit: int = Query(50, ge=1, le=100, description="Limit entries for pagination"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Get all anime list entries for the current user.
    """
    return await entry_service.get_user_entries(db, user_id=current_user.id, status_filter=status_filter, skip=skip, limit=limit)

@router.patch("/{mal_id}", response_model=EntryResponse)
async def update_entry(
    entry_in: EntryUpdate,
    mal_id: int = Path(..., description="The MyAnimeList ID of the anime to update"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Update an existing anime entry on the current user's list.
    """
    return await entry_service.update_anime_entry(db, user_id=current_user.id, mal_id=mal_id, entry_in=entry_in)

@router.delete("/{mal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_entry(
    mal_id: int = Path(..., description="The MyAnimeList ID of the anime to remove"),
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Remove an anime from the current user's list.
    """
    await entry_service.remove_anime_entry(db, user_id=current_user.id, mal_id=mal_id)
    return None
