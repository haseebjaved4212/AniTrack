from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class UserAnimeEntry(Base):
    __tablename__ = "user_anime_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    anime_id = Column(Integer, ForeignKey("anime.id"), nullable=False)
    status = Column(String, nullable=False, default="Plan to Watch") # "Watching", "Completed", "Plan to Watch", "Dropped", "On Hold"
    rating = Column(Integer, nullable=True)
    progress = Column(Integer, default=0, nullable=False)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="entries")
    anime = relationship("Anime", back_populates="entries")

    __table_args__ = (
        UniqueConstraint("user_id", "anime_id", name="uix_user_anime"),
    )
