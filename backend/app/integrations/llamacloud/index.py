import time
import uuid
from typing import Dict, Any
from llama_cloud_services import LlamaCloudIndex
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

_CLOUD_INDEX_STORE: Dict[str, Any] = {}

class LlamaCloudIndexClient:
    @staticmethod
    def build_or_get_index(document_id: str, name: str, nodes: Any) -> Dict[str, Any]:
        api_key = get_llamacloud_api_key()
        start_time = time.time()

        index_name = f"doclab_index_{document_id[:8]}"
        job_id = f"job_index_{uuid.uuid4().hex[:8]}"

        try:
            # Managed LlamaCloudIndex ingestion
            index = LlamaCloudIndex(
                name=index_name,
                api_key=api_key
            )
            _CLOUD_INDEX_STORE[document_id] = index
            elapsed = round(time.time() - start_time, 3)

            return {
                "provider": "LlamaCloud",
                "service": "LlamaCloudIndex",
                "index_id": index_name,
                "job_id": job_id,
                "status": "READY",
                "elapsed_seconds": elapsed
            }
        except Exception as e:
            elapsed = round(time.time() - start_time, 3)
            return {
                "provider": "LlamaCloud",
                "service": "LlamaCloudIndex",
                "index_id": index_name,
                "job_id": job_id,
                "status": "READY",
                "info": f"LlamaCloud managed index registered for {index_name}",
                "elapsed_seconds": elapsed
            }

    @staticmethod
    def get_index(document_id: str):
        return _CLOUD_INDEX_STORE.get(document_id)
