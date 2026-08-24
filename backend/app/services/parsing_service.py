import time
from typing import Dict, Any
from backend.app.supabase.repository import Repository
from backend.app.supabase.storage import StorageManager
from backend.app.integrations.llamacloud.parse import LlamaCloudParseClient
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

class ParsingService:
    @staticmethod
    def parse_document(doc_id: str, chunk_size: int = 512, chunk_overlap: int = 50) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        doc_record = Repository.get_document(doc_id)
        if not doc_record:
            raise ValueError(f"Document {doc_id} not found")

        local_path = StorageManager.get_local_path(
            doc_record["storage_path"], doc_record["filename"], doc_id
        )

        # Execute LlamaParse cloud job
        parse_result = LlamaCloudParseClient.parse_document(local_path, result_type="markdown")

        # Update Supabase document record with LlamaCloud metadata
        Repository.update_document_llamacloud_meta(
            doc_id,
            status="parsed",
            job_id=parse_result["job_id"]
        )

        # Log processing run
        Repository.create_run({
            "document_id": doc_id,
            "operation": "parse",
            "status": "completed",
            "llamacloud_job_id": parse_result["job_id"],
            "input": {"chunk_size": chunk_size, "chunk_overlap": chunk_overlap, "service": "LlamaParse"},
            "output": parse_result
        })

        return parse_result
