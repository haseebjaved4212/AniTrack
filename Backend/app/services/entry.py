from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException
from typing import List, Optional

from app.models.entry import UserAnimeEntry
from app.models.anime import Anime
from app.schemas.entry import EntryCreate, EntryUpdate
from app.services import jikan

async def get_or_create_anime(db: AsyncSession, mal_id: int) -> Anime:
    """Check if anime exists locally, if not, fetch from Jikan and save to DB."""
    result = await db.execute(select(Anime).filter(Anime.id == mal_id))
    anime = result.scalars().first()
    
    if anime:
        return anime

    # Fetch from Jikan API
    try:
        jikan_anime = await jikan.get_anime_by_id(mal_id)
        data = jikan_anime.data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Anime not found on MyAnimeList: {str(e)}")

    # Save to local DB
    new_anime = Anime(
        id=data.mal_id,
        title=data.title,
        synopsis=data.synopsis,
        image_url=data.image_url,
        episodes=data.episodes,
        status=data.status,
        score=data.score
    )
    db.add(new_anime)
    try:
        await db.commit()
        await db.refresh(new_anime)
    except Exception:
        await db.rollback()
        # In case of race conditions, someone else might have inserted it
        result = await db.execute(select(Anime).filter(Anime.id == mal_id))
        return result.scalars().first()

    return new_anime

async def add_anime_entry(db: AsyncSession, user_id: int, mal_id: int, entry_in: EntryCreate) -> UserAnimeEntry:
    # 1. Ensure anime exists in local DB
    await get_or_create_anime(db, mal_id)
    
    # 2. Check if entry already exists
    result = await db.execute(
        select(UserAnimeEntry).filter(UserAnimeEntry.user_id == user_id, UserAnimeEntry.anime_id == mal_id)
    )
    existing_entry = result.scalars().first()
    if existing_entry:
        raise HTTPException(status_code=400, detail="Anime is already in your list")
        
    # 3. Create entry
    new_entry = UserAnimeEntry(
        user_id=user_id,
        anime_id=mal_id,
        status=entry_in.status,
        rating=entry_in.rating,
        progress=entry_in.progress,
        notes=entry_in.notes
    )
    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)
    
    # Reload with anime relationship for the response
    result = await db.execute(
        select(UserAnimeEntry).options(selectinload(UserAnimeEntry.anime)).filter(UserAnimeEntry.id == new_entry.id)
    )
    return result.scalars().first()

async def get_user_entries(db: AsyncSession, user_id: int, status_filter: Optional[str] = None, skip: int = 0, limit: int = 50) -> List[UserAnimeEntry]:
    query = select(UserAnimeEntry).options(selectinload(UserAnimeEntry.anime)).filter(UserAnimeEntry.user_id == user_id)
    
    if status_filter:
        query = query.filter(UserAnimeEntry.status == status_filter)
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def update_anime_entry(db: AsyncSession, user_id: int, mal_id: int, entry_in: EntryUpdate) -> UserAnimeEntry:
    result = await db.execute(
        select(UserAnimeEntry).options(selectinload(UserAnimeEntry.anime)).filter(
            UserAnimeEntry.user_id == user_id, UserAnimeEntry.anime_id == mal_id
        )
    )
    entry = result.scalars().first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Anime not found in your list")
        
    update_data = entry_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)
        
    await db.commit()
    await db.refresh(entry)
    return entry

async def remove_anime_entry(db: AsyncSession, user_id: int, mal_id: int) -> bool:
    result = await db.execute(
        select(UserAnimeEntry).filter(UserAnimeEntry.user_id == user_id, UserAnimeEntry.anime_id == mal_id)
    )
    entry = result.scalars().first()
    
    if not entry:
        raise HTTPException(status_code=404, detail="Anime not found in your list")
        
    await db.delete(entry)
    await db.commit()
    return True

from sqlalchemy import func

async def get_user_stats(db: AsyncSession, user_id: int) -> dict:
    # 1. Total anime watched
    total_query = select(func.count(UserAnimeEntry.id)).filter(UserAnimeEntry.user_id == user_id)
    total_result = await db.execute(total_query)
    total_anime = total_result.scalar() or 0

    # 2. Total episodes watched (sum of progress)
    episodes_query = select(func.sum(UserAnimeEntry.progress)).filter(UserAnimeEntry.user_id == user_id)
    episodes_result = await db.execute(episodes_query)
    total_episodes = episodes_result.scalar() or 0

    # 3. Average rating
    rating_query = select(func.avg(UserAnimeEntry.rating)).filter(
        UserAnimeEntry.user_id == user_id, 
        UserAnimeEntry.rating.isnot(None)
    )
    rating_result = await db.execute(rating_query)
    average_rating = rating_result.scalar()
    average_rating = round(float(average_rating), 2) if average_rating else 0.0

    # 4. Status distribution
    status_query = select(UserAnimeEntry.status, func.count(UserAnimeEntry.id)).filter(
        UserAnimeEntry.user_id == user_id
    ).group_by(UserAnimeEntry.status)
    status_result = await db.execute(status_query)
    status_distribution = {row[0]: row[1] for row in status_result.all()}

    return {
        "total_anime": total_anime,
        "total_episodes": total_episodes,
        "average_rating": average_rating,
        "status_distribution": status_distribution
    }
