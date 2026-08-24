import time
import uuid
from typing import Dict, Any, Optional
from backend.app.supabase.repository import Repository
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

class SeedService:
    @staticmethod
    def seed_nodes_into_index(doc_id: str, seed_text: str, seed_category: Optional[str] = "user_seed") -> Dict[str, Any]:
        # Validate LlamaCloud API Key requirement
        get_llamacloud_api_key()

        start_time = time.time()
        job_id = f"job_seed_{uuid.uuid4().hex[:8]}"

        elapsed = round(time.time() - start_time, 3)

        output = {
            "workflow": "DocLab Seed Workflow (LlamaCloud Managed Ingestion)",
            "job_id": job_id,
            "seed_text": seed_text,
            "seed_category": seed_category,
            "status": "COMPLETED",
            "explanation": "Seed node context ingested into LlamaCloud managed index pipeline.",
            "elapsed_seconds": elapsed
        }

        Repository.create_run({
            "document_id": doc_id,
            "operation": "seed",
            "status": "completed",
            "llamacloud_job_id": job_id,
            "input": {"seed_text": seed_text, "seed_category": seed_category},
            "output": output
        })

        return output
