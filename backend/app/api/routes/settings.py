from fastapi import APIRouter
from backend.app.config import settings, update_runtime_settings
from backend.app.schemas.settings import SettingsUpdateRequest, SettingsStatusResponse

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=SettingsStatusResponse)
def get_settings_status():
    return SettingsStatusResponse(
        has_llamacloud_key=bool(settings.LLAMA_CLOUD_API_KEY and settings.LLAMA_CLOUD_API_KEY.strip() != ""),
        llm_provider=settings.LLM_PROVIDER,
        llm_model=settings.LLM_MODEL,
        has_llm_key=bool(settings.LLM_API_KEY),
        embedding_provider=settings.EMBEDDING_PROVIDER,
        embedding_model=settings.EMBEDDING_MODEL,
        has_embedding_key=bool(settings.EMBEDDING_API_KEY or settings.LLM_API_KEY),
        has_supabase=bool(settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY),
        storage_dir=settings.STORAGE_DIR
    )

@router.post("", response_model=SettingsStatusResponse)
def update_settings(req: SettingsUpdateRequest):
    update_runtime_settings(
        llama_cloud_api_key=req.llama_cloud_api_key,
        llm_provider=req.llm_provider,
        llm_api_key=req.llm_api_key,
        llm_model=req.llm_model,
        embedding_provider=req.embedding_provider,
        embedding_api_key=req.embedding_api_key,
        embedding_model=req.embedding_model,
        supabase_url=req.supabase_url,
        supabase_key=req.supabase_key
    )
    return get_settings_status()
