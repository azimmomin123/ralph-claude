import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    """Application settings."""

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/sellerhub-dashboard-v1"
    )

    # Amazon SP-API
    SP_API_CLIENT_ID: str = os.getenv("SP_API_CLIENT_ID", "")
    SP_API_CLIENT_SECRET: str = os.getenv("SP_API_CLIENT_SECRET", "")
    SP_API_REFRESH_TOKEN: str = os.getenv("SP_API_REFRESH_TOKEN", "")
    SP_API_MARKETPLACE: str = os.getenv("SP_API_MARKETPLACE", "A37GYEPKANKGKF")
    SP_API_REGION: str = os.getenv("SP_API_REGION", "na")

    # Supabase (Auth Only)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # App settings
    DEBUG: bool = os.getenv("DEBUG", "true").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
