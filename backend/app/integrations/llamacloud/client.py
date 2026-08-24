import os
from typing import Optional
from backend.app.config import settings

def get_llamacloud_api_key() -> str:
    key = settings.LLAMA_CLOUD_API_KEY or os.environ.get("LLAMA_CLOUD_API_KEY", "")
    if not key or key.strip() == "":
        raise ValueError("LLAMA_CLOUD_API_KEY is not configured. Please set your LlamaCloud API Key in Settings.")
    return key.strip()

def check_llamacloud_configured() -> bool:
    key = settings.LLAMA_CLOUD_API_KEY or os.environ.get("LLAMA_CLOUD_API_KEY", "")
    return bool(key and key.strip() != "")
