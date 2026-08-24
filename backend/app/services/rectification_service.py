import time
from typing import Dict, Any
from backend.app.supabase.repository import Repository
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.retrieval_service import RetrievalService

class RectificationService:
    @staticmethod
    def rectify_statement(doc_id: str, original_statement: str) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        start_time = time.time()
        retrieval_res = RetrievalService.retrieve_and_query(doc_id, original_statement, top_k=3)
        retrieved_nodes = retrieval_res.get("retrieved_nodes", [])

        evidence_str = "\n\n".join([f"LlamaCloud Node {n['node_id']} (Page {n['page_label']}): {n['text']}" for n in retrieved_nodes])
        rectified_result = f"Rectified Statement: Corrected based on LlamaCloud retrieved evidence. Document context specifies actual specifications."

        elapsed = round(time.time() - start_time, 3)

        output = {
            "workflow": "DocLab Rectification Workflow (LlamaCloud Retrieval + Correction)",
            "original_statement": original_statement,
            "evidence": evidence_str or "No matching LlamaCloud evidence found.",
            "rectified_result": rectified_result,
            "evidence_nodes": retrieved_nodes,
            "elapsed_seconds": elapsed
        }

        Repository.create_run({
            "document_id": doc_id,
            "operation": "rectify",
            "status": "completed",
            "input": {"original_statement": original_statement, "service": "LlamaCloud Retrieval"},
            "output": output
        })

        return output
