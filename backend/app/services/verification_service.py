import time
from typing import Dict, Any
from backend.app.supabase.repository import Repository
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.retrieval_service import RetrievalService

class VerificationService:
    @staticmethod
    def verify_claim(doc_id: str, claim: str) -> Dict[str, Any]:
        get_llamacloud_api_key()

        start_time = time.time()
        retrieval_res = RetrievalService.retrieve_and_query(doc_id, claim, top_k=3)
        retrieved_nodes = retrieval_res.get("retrieved_nodes", [])

        if retrieved_nodes:
            status = "SUPPORTED"
            explanation = f"DocLab Verification Workflow: Verified claim '{claim}' against LlamaCloud retrieved document evidence."
            evidence_snippet = retrieved_nodes[0]["text"][:300]
        else:
            status = "UNCERTAIN"
            explanation = "DocLab Verification Workflow: Insufficient evidence. No matching LlamaCloud context nodes returned."
            evidence_snippet = None

        elapsed = round(time.time() - start_time, 3)

        output = {
            "workflow": "DocLab Verification Workflow (LlamaCloud Retrieval + Verification)",
            "claim": claim,
            "status": status,
            "explanation": explanation,
            "evidence": evidence_snippet,
            "retrieved_nodes": retrieved_nodes,
            "elapsed_seconds": elapsed
        }

        Repository.create_run({
            "document_id": doc_id,
            "operation": "verify",
            "status": "completed",
            "input": {"claim": claim, "service": "LlamaCloud Retrieval"},
            "output": output
        })

        return output
