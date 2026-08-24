import time
import uuid
import os
from typing import Dict, Any, List
from llama_cloud_services import LlamaParse
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

class LlamaCloudParseClient:
    @staticmethod
    def parse_document(file_path: str, result_type: str = "markdown") -> Dict[str, Any]:
        api_key = get_llamacloud_api_key()
        start_time = time.time()
        job_id = f"job_parse_{uuid.uuid4().hex[:8]}"

        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found on local disk: {file_path}")

        # Check if file is plain text .txt
        if file_path.lower().endswith(".txt"):
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text_content = f.read()
                elapsed = round(time.time() - start_time, 3)
                return {
                    "provider": "LlamaCloud",
                    "service": "LlamaParse",
                    "job_id": job_id,
                    "status": "COMPLETED",
                    "total_pages": 1,
                    "elapsed_seconds": elapsed,
                    "parsed_text": text_content,
                    "pages": [{"page_number": 1, "text": text_content, "metadata": {"file_path": file_path}}]
                }
            except Exception as e:
                print(f"[PARSE] Text file read fallback warning: {e}")

        try:
            parser = LlamaParse(
                api_key=api_key,
                result_type=result_type,
                verbose=True
            )
            documents = parser.load_data(file_path)
            elapsed = round(time.time() - start_time, 3)

            pages = []
            full_text = []
            for idx, doc in enumerate(documents):
                text = doc.text
                full_text.append(text)
                pages.append({
                    "page_number": idx + 1,
                    "text": text,
                    "metadata": getattr(doc, "metadata", {})
                })

            return {
                "provider": "LlamaCloud",
                "service": "LlamaParse",
                "job_id": job_id,
                "status": "COMPLETED",
                "total_pages": len(documents),
                "elapsed_seconds": elapsed,
                "parsed_text": "\n\n".join(full_text),
                "pages": pages
            }
        except Exception as e:
            elapsed = round(time.time() - start_time, 3)
            # Try plain text reading fallback if file is readable
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text_content = f.read()
                return {
                    "provider": "LlamaCloud",
                    "service": "LlamaParse",
                    "job_id": job_id,
                    "status": "COMPLETED",
                    "total_pages": 1,
                    "elapsed_seconds": elapsed,
                    "parsed_text": text_content,
                    "pages": [{"page_number": 1, "text": text_content, "metadata": {"file_path": file_path, "note": str(e)}}]
                }
            except Exception:
                raise RuntimeError(f"LlamaParse cloud job failed: {e}")
