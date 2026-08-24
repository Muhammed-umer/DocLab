import os
from typing import Optional
from supabase import create_client, Client
from backend.app.config import settings

def get_supabase_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in .env.")
    try:
        return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    except Exception as e:
        raise RuntimeError(f"Failed to initialize Supabase client: {e}")
