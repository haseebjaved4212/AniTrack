from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AniTrack"
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    JIKAN_API_BASE_URL: str = "https://api.jikan.moe/v4"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
