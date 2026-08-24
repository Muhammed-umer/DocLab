import time
import uuid
from typing import Dict, Any, List
from llama_cloud_services import LlamaCloudRetriever
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

class LlamaCloudRetrieveClient:
    @staticmethod
    def retrieve_context(index_name: str, query: str, top_k: int = 4) -> Dict[str, Any]:
        api_key = get_llamacloud_api_key()
        start_time = time.time()
        job_id = f"job_retrieve_{uuid.uuid4().hex[:8]}"

        try:
            retriever = LlamaCloudRetriever(
                name=index_name,
                api_key=api_key,
                dense_similarity_top_k=top_k
            )
            nodes = retriever.retrieve(query)
            elapsed = round(time.time() - start_time, 3)

            retrieved_chunks = []
            for idx, n in enumerate(nodes):
                retrieved_chunks.append({
                    "rank": idx + 1,
                    "node_id": getattr(n.node, "node_id", f"cloud_node_{idx+1}"),
                    "text": n.node.get_content(),
                    "similarity_score": round(n.score, 4) if getattr(n, "score", None) is not None else None,
                    "page_label": n.node.metadata.get("page_label", "1") if hasattr(n.node, "metadata") else "1"
                })

            return {
                "provider": "LlamaCloud",
                "service": "LlamaCloudRetriever",
                "job_id": job_id,
                "status": "COMPLETED",
                "query": query,
                "retrieved_nodes": retrieved_chunks,
                "elapsed_seconds": elapsed
            }
        except Exception as e:
            elapsed = round(time.time() - start_time, 3)
            return {
                "provider": "LlamaCloud",
                "service": "LlamaCloudRetriever",
                "job_id": job_id,
                "status": "COMPLETED",
                "query": query,
                "retrieved_nodes": [],
                "error_info": str(e),
                "elapsed_seconds": elapsed
            }
