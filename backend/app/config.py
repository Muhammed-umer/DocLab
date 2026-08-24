import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    LLAMA_CLOUD_API_KEY: str = ""
    
    LLM_PROVIDER: str = "openai"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o-mini"
    
    EMBEDDING_PROVIDER: str = "openai"
    EMBEDDING_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_BUCKET: str = "document-lab"
    
    CLERK_PUBLISHABLE_KEY: str = ""
    CLERK_SECRET_KEY: str = ""
    
    STORAGE_DIR: str = str(BASE_DIR / "storage_uploads")
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)

def update_runtime_settings(
    llama_cloud_api_key: Optional[str] = None,
    llm_provider: Optional[str] = None,
    llm_api_key: Optional[str] = None,
    llm_model: Optional[str] = None,
    embedding_provider: Optional[str] = None,
    embedding_api_key: Optional[str] = None,
    embedding_model: Optional[str] = None,
    supabase_url: Optional[str] = None,
    supabase_key: Optional[str] = None,
    clerk_publishable_key: Optional[str] = None,
    clerk_secret_key: Optional[str] = None
):
    global settings
    if llama_cloud_api_key is not None: settings.LLAMA_CLOUD_API_KEY = llama_cloud_api_key
    if llm_provider is not None: settings.LLM_PROVIDER = llm_provider
    if llm_api_key is not None: settings.LLM_API_KEY = llm_api_key
    if llm_model is not None: settings.LLM_MODEL = llm_model
    if embedding_provider is not None: settings.EMBEDDING_PROVIDER = embedding_provider
    if embedding_api_key is not None: settings.EMBEDDING_API_KEY = embedding_api_key
    if embedding_model is not None: settings.EMBEDDING_MODEL = embedding_model
    if supabase_url is not None: settings.SUPABASE_URL = supabase_url
    if supabase_key is not None: settings.SUPABASE_SERVICE_ROLE_KEY = supabase_key
    if clerk_publishable_key is not None: settings.CLERK_PUBLISHABLE_KEY = clerk_publishable_key
    if clerk_secret_key is not None: settings.CLERK_SECRET_KEY = clerk_secret_key
    
    try:
        env_dict = {
            "LLAMA_CLOUD_API_KEY": settings.LLAMA_CLOUD_API_KEY,
            "LLM_PROVIDER": settings.LLM_PROVIDER,
            "LLM_API_KEY": settings.LLM_API_KEY,
            "LLM_MODEL": settings.LLM_MODEL,
            "EMBEDDING_PROVIDER": settings.EMBEDDING_PROVIDER,
            "EMBEDDING_API_KEY": settings.EMBEDDING_API_KEY,
            "EMBEDDING_MODEL": settings.EMBEDDING_MODEL,
            "SUPABASE_URL": settings.SUPABASE_URL,
            "SUPABASE_SERVICE_ROLE_KEY": settings.SUPABASE_SERVICE_ROLE_KEY,
            "SUPABASE_BUCKET": settings.SUPABASE_BUCKET,
            "CLERK_PUBLISHABLE_KEY": settings.CLERK_PUBLISHABLE_KEY,
            "CLERK_SECRET_KEY": settings.CLERK_SECRET_KEY,
            "HOST": settings.HOST,
            "PORT": str(settings.PORT),
        }
        with open(ENV_FILE, "w", encoding="utf-8") as f:
            for k, v in env_dict.items():
                f.write(f"{k}={v}\n")
    except Exception as e:
        print(f"Warning: Failed to persist .env updates: {e}")

    return settings
