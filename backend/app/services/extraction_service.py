import time
from typing import Dict, Any, List, Optional
from backend.app.supabase.repository import Repository
from backend.app.supabase.storage import StorageManager
from backend.app.integrations.llamacloud.extract import LlamaCloudExtractClient
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.parsing_service import ParsingService

class ExtractionService:
    @staticmethod
    def extract_information(doc_id: str, fields: Optional[List[str]] = None) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        doc_record = Repository.get_document(doc_id)
        if not doc_record:
            raise ValueError(f"Document {doc_id} not found")

        local_path = StorageManager.get_local_path(
            doc_record["storage_path"], doc_record["filename"], doc_id
        )

        target_fields = fields or ["title", "author", "role", "experience", "skills", "cgpa"]

        # Parse real document text using LlamaParse
        doc_text = ""
        try:
            parse_res = ParsingService.parse_document(doc_id)
            doc_text = parse_res.get("parsed_text", "")
        except Exception as e:
            print(f"[EXTRACTION] Parsing step notice: {e}")

        # Execute extraction over real parsed PDF text
        extract_result = LlamaCloudExtractClient.extract_information(
            file_path=local_path,
            schema_fields=target_fields,
            doc_text=doc_text
        )

        Repository.create_run({
            "document_id": doc_id,
            "operation": "extract",
            "status": "completed",
            "llamacloud_job_id": extract_result["job_id"],
            "input": {"fields": target_fields, "service": "LlamaExtract"},
            "output": extract_result
        })

        return extract_result
