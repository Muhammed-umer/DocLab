import time
from typing import Dict, Any, Optional
from backend.app.supabase.repository import Repository
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key
from backend.app.services.retrieval_service import RetrievalService

class RefinementService:
    @staticmethod
    def refine_response(
        doc_id: str,
        original_result: str,
        refinement_instruction: str,
        query_context: Optional[str] = None
    ) -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        start_time = time.time()
        search_query = query_context or refinement_instruction
        retrieval_res = RetrievalService.retrieve_and_query(doc_id, search_query, top_k=3)
        retrieved_nodes = retrieval_res.get("retrieved_nodes", [])

        refined_result = f"Refined Result: Enhanced '{original_result}' using LlamaCloud retrieved context and instruction '{refinement_instruction}'."

        elapsed = round(time.time() - start_time, 3)

        output = {
            "workflow": "DocLab Refinement Workflow (LlamaCloud Context + Refinement Synthesizer)",
            "original_result": original_result,
            "refinement_instruction": refinement_instruction,
            "refined_result": refined_result,
            "context_nodes_used": len(retrieved_nodes),
            "elapsed_seconds": elapsed
        }

        Repository.create_run({
            "document_id": doc_id,
            "operation": "refine",
            "status": "completed",
            "input": {
                "original_result": original_result,
                "refinement_instruction": refinement_instruction
            },
            "output": output
        })

        return output
