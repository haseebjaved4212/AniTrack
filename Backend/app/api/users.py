from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.api import deps
from app.models.user import User
from app.schemas.stats import UserStats
from app.services import entry as entry_service

router = APIRouter()

@router.get("/me/stats", response_model=UserStats)
async def get_my_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get statistics for the current user's anime list.
    """
    return await entry_service.get_user_stats(db, user_id=current_user.id)
