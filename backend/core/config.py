from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "MarketingOS"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/marketing_os"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # OpenAI
    OPENAI_API_KEY: str = ""

    # Stable Diffusion
    STABLE_DIFFUSION_API_URL: str = "http://stable-diffusion:7860"

    # Google Ads
    GOOGLE_ADS_CLIENT_ID: Optional[str] = None
    GOOGLE_ADS_CLIENT_SECRET: Optional[str] = None

    # Facebook Ads
    FACEBOOK_ADS_ACCESS_TOKEN: Optional[str] = None

    # LinkedIn Ads
    LINKEDIN_ADS_ACCESS_TOKEN: Optional[str] = None

    model_config = {"env_file": ".env", "extra": "allow"}


settings = Settings()
