from fastapi import FastAPI, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from starlette.exceptions import HTTPException as StarletteHTTPException
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

# CORS Config
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "HTTP Exception", "detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Validation Error", "detail": exc.errors()},
    )

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(users_router, prefix="/users", tags=["users"])
app.include_router(anime_router, prefix="/anime", tags=["anime"])
app.include_router(entries_router, prefix="/entries", tags=["entries"])

from app.api import deps

@app.get("/health")
async def health_check(db: AsyncSession = Depends(deps.get_db)):
    health_status = {"status": "ok"}
    
    try:
        await db.execute(text("SELECT 1"))
        health_status["database"] = "ok"
    except Exception as e:
        health_status["database"] = f"error: {str(e)}"
        
    try:
        if redis_cache.client:
            await redis_cache.client.ping()
            health_status["redis"] = "ok"
        else:
            health_status["redis"] = "disconnected"
    except Exception as e:
        health_status["redis"] = f"error: {str(e)}"
        
    return health_status

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}
