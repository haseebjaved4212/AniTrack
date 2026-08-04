from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.anime import router as anime_router
from app.api.entries import router as entries_router
from app.api.users import router as users_router
from app.db.redis import redis_cache

@asynccontextmanager
async def lifespan(app: FastAPI):
    await redis_cache.connect()
    yield
    await redis_cache.close()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(anime_router, prefix="/anime", tags=["anime"])
app.include_router(entries_router, prefix="/entries", tags=["entries"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
