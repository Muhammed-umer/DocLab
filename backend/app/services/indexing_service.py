import time
from typing import Dict, Any
from backend.app.supabase.repository import Repository
from backend.app.integrations.llamacloud.index import LlamaCloudIndexClient
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.parsing_service import ParsingService

class IndexingService:
    @staticmethod
    def build_index(doc_id: str, force_rebuild: bool = False) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        doc_record = Repository.get_document(doc_id)
        if not doc_record:
            raise ValueError(f"Document {doc_id} not found")

        # Execute LlamaCloud managed indexing
        index_result = LlamaCloudIndexClient.build_or_get_index(
            document_id=doc_id,
            name=doc_record["filename"],
            nodes=None
        )

        Repository.update_document_llamacloud_meta(
            doc_id,
            status="indexed",
            index_id=index_result["index_id"],
            job_id=index_result["job_id"]
        )

        Repository.create_run({
            "document_id": doc_id,
            "operation": "index",
            "status": "completed",
            "llamacloud_job_id": index_result["job_id"],
            "input": {"force_rebuild": force_rebuild, "service": "LlamaCloudIndex"},
            "output": index_result
        })

        return index_result
