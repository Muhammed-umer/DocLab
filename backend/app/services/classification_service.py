import time
from typing import Dict, Any
from backend.app.supabase.repository import Repository
from backend.app.supabase.storage import StorageManager
from backend.app.integrations.llamacloud.classify import LlamaCloudClassifyClient
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.parsing_service import ParsingService

class ClassificationService:
    @staticmethod
    def classify_document(doc_id: str) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        doc_record = Repository.get_document(doc_id)
        if not doc_record:
            raise ValueError(f"Document {doc_id} not found")

        local_path = StorageManager.get_local_path(
            doc_record["storage_path"], doc_record["filename"], doc_id
        )

        parse_res = ParsingService.parse_document(doc_id)
        parsed_text = parse_res.get("parsed_text", "")

        # Execute LlamaCloud Classify service
        classify_result = LlamaCloudClassifyClient.classify_document(local_path, parsed_text)

        Repository.create_run({
            "document_id": doc_id,
            "operation": "classify",
            "status": "completed",
            "llamacloud_job_id": classify_result["job_id"],
            "input": {"service": "LlamaCloud Classify"},
            "output": classify_result
        })

        return classify_result
