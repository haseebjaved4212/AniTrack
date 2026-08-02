from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base

class Anime(Base):
    __tablename__ = "anime"

    id = Column(Integer, primary_key=True, index=True) # Will map to Jikan's mal_id
    title = Column(String, index=True, nullable=False)
    synopsis = Column(Text, nullable=True)
    image_url = Column(String, nullable=True)
    episodes = Column(Integer, nullable=True)
    status = Column(String, nullable=True)
    score = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    entries = relationship("UserAnimeEntry", back_populates="anime", cascade="all, delete-orphan")
