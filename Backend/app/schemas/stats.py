from pydantic import BaseModel
from typing import Dict

class UserStats(BaseModel):
    total_anime: int
    total_episodes: int
    average_rating: float
    status_distribution: Dict[str, int]
