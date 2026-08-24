from pydantic import BaseModel
from typing import Optional

class SettingsUpdateRequest(BaseModel):
    llama_cloud_api_key: Optional[str] = None
    llm_provider: Optional[str] = None
    llm_api_key: Optional[str] = None
    llm_model: Optional[str] = None
    embedding_provider: Optional[str] = None
    embedding_api_key: Optional[str] = None
    embedding_model: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None

class SettingsStatusResponse(BaseModel):
    has_llamacloud_key: bool
    llm_provider: str
    llm_model: str
    has_llm_key: bool
    embedding_provider: str
    embedding_model: str
    has_embedding_key: bool
    has_supabase: bool
    storage_dir: str
