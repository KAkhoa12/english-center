from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "english-center-api"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    API_V1_PREFIX: str = "/api/v1"

    POSTGRES_DB: str = "english_center_db"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str | None = None

    JWT_SECRET_KEY: str = Field(default="change_me", min_length=8)
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    MINIO_ENDPOINT: str
    MINIO_PUBLIC_ENDPOINT: str = "localhost:9000"
    MINIO_ROOT_USER: str = "minioadmin"
    MINIO_ROOT_PASSWORD: str = "minioadmin"
    MINIO_SECURE: bool = True

    MINIO_BUCKET_AVATARS: str = "avatars"
    MINIO_BUCKET_MATERIALS: str = "materials"
    MINIO_BUCKET_SUBMISSIONS: str = "submissions"
    MINIO_BUCKET_VIDEOS: str = "videos"
    MINIO_BUCKET_EXPORTS: str = "exports"

    MINIO_PRESIGNED_EXPIRE_SECONDS: int = 3600

    SEPAY_ENV: str = "sandbox"
    SEPAY_BASE_URL: str = "https://pgapi-sandbox.sepay.vn"
    SEPAY_CHECKOUT_URL: str = "https://pay-sandbox.sepay.vn/v1/checkout/init"
    SEPAY_MERCHANT_ID: str = "your_sandbox_merchant_id"
    SEPAY_SECRET_KEY: str = "your_sandbox_secret_key"
    SEPAY_IPN_SECRET_KEY: str = "your_ipn_secret_key"
    SEPAY_SUCCESS_URL: str = "http://localhost:5173/payment/success"
    SEPAY_ERROR_URL: str = "http://localhost:5173/payment/error"
    SEPAY_CANCEL_URL: str = "http://localhost:5173/payment/cancel"
    SEPAY_CURRENCY: str = "VND"

    APP_PUBLIC_API_URL: str = "http://localhost:8000/api/v1"
    FRONTEND_URL: str = "http://localhost:5173"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_API_KEY: str
    OLLAMA_LOW_LLM_MODEL: str = "gpt-oss:20b-cloud"
    OLLAMA_HIGH_LLM_MODEL: str = "gpt-oss:120b-cloud"
    OLLAMA_RERANK_MODEL: str = "bge-reranker-v2-m3"
    OLLAMA_EMBEDDING_MODEL: str = "nomic-embed-text"
    OLLAMA_TIMEOUT_SECONDS: int = Field(default=120, ge=1, le=3600)
    OLLAMA_TEMPERATURE: float = Field(default=0.2, ge=0.0, le=1)

    LANGGRAPH_CHECKPOINTER: str = "memory"
    LANGGRAPH_THREAD_ID_PREFIX: str = "ec"
    LANGGRAPH_RECURSION_LIMIT: int = Field(default=50, ge=1, le=500)

    QDRANT_URL: str | None = None
    QDRANT_API_KEY: str | None = None
    QDRANT_COLLECTION_PREFIX: str = "english_center"

    @field_validator("OLLAMA_BASE_URL")
    @classmethod
    def normalize_ollama_base_url(cls, value: str) -> str:
        return value.rstrip("/")

    @property
    def LANGGRAPH_DEFAULT_CONFIG(self) -> dict:
        return {
            "recursion_limit": self.LANGGRAPH_RECURSION_LIMIT,
            "configurable": {"thread_id": f"{self.LANGGRAPH_THREAD_ID_PREFIX}-default"},
        }

    @property
    def SQLALCHEMY_DATABASE_URL(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return (
            f"postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
