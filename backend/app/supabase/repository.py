import json
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from backend.app.supabase.client import get_supabase_client

class Repository:
    @staticmethod
    def create_document(doc_data: Dict[str, Any], user_id: str = "default_user") -> Dict[str, Any]:
        client = get_supabase_client()
        doc_id = doc_data.get("id") or str(uuid.uuid4())
        now = datetime.utcnow().isoformat()
        
        record = {
            "id": doc_id,
            "filename": doc_data["filename"],
            "storage_path": doc_data["storage_path"],
            "file_type": doc_data["file_type"],
            "file_size": doc_data["file_size"],
            "user_id": user_id,
            "llamacloud_file_id": doc_data.get("llamacloud_file_id"),
            "llamacloud_job_id": doc_data.get("llamacloud_job_id"),
            "llamacloud_index_id": doc_data.get("llamacloud_index_id"),
            "status": doc_data.get("status", "uploaded"),
            "created_at": now,
            "updated_at": now,
        }

        try:
            res = client.table("documents").insert(record).execute()
            return res.data[0] if res.data else record
        except Exception as e:
            print(f"[REPOSITORY] Insert document warning: {e}")
            try:
                record_no_user = {k: v for k, v in record.items() if k != "user_id"}
                res = client.table("documents").insert(record_no_user).execute()
                return res.data[0] if res.data else record
            except Exception as e2:
                print(f"[REPOSITORY] Insert document fallback: {e2}")
                return record

    @staticmethod
    def get_document(doc_id: str) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        try:
            res = client.table("documents").select("*").eq("id", doc_id).execute()
            return res.data[0] if res.data else None
        except Exception as e:
            print(f"[REPOSITORY] Get document error: {e}")
            return None

    @staticmethod
    def list_documents(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        client = get_supabase_client()
        try:
            q = client.table("documents").select("*").order("created_at", desc=True)
            if user_id and user_id != "default_user":
                try:
                    q = q.eq("user_id", user_id)
                except Exception:
                    pass
            res = q.execute()
            return res.data if res.data is not None else []
        except Exception as e:
            print(f"[REPOSITORY] List documents error: {e}")
            return []

    @staticmethod
    def update_document_llamacloud_meta(
        doc_id: str,
        status: Optional[str] = None,
        file_id: Optional[str] = None,
        job_id: Optional[str] = None,
        index_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        client = get_supabase_client()
        now = datetime.utcnow().isoformat()
        updates: Dict[str, Any] = {"updated_at": now}
        if status is not None: updates["status"] = status
        if file_id is not None: updates["llamacloud_file_id"] = file_id
        if job_id is not None: updates["llamacloud_job_id"] = job_id
        if index_id is not None: updates["llamacloud_index_id"] = index_id

        try:
            res = client.table("documents").update(updates).eq("id", doc_id).execute()
            return res.data[0] if res.data else Repository.get_document(doc_id)
        except Exception as e:
            print(f"[REPOSITORY] Update meta error: {e}")
            return Repository.get_document(doc_id)

    @staticmethod
    def delete_document(doc_id: str) -> bool:
        client = get_supabase_client()
        try:
            client.table("document_processing_runs").delete().eq("document_id", doc_id).execute()
        except Exception:
            pass
        try:
            client.table("documents").delete().eq("id", doc_id).execute()
        except Exception:
            pass
        return True

    @staticmethod
    def create_run(run_data: Dict[str, Any], user_id: str = "default_user") -> Dict[str, Any]:
        client = get_supabase_client()
        run_id = run_data.get("id") or f"run_{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow().isoformat()
        
        input_str = json.dumps(run_data.get("input", {})) if isinstance(run_data.get("input"), (dict, list)) else str(run_data.get("input", ""))
        output_str = json.dumps(run_data.get("output", {})) if isinstance(run_data.get("output"), (dict, list)) else str(run_data.get("output", ""))

        record = {
            "id": run_id,
            "document_id": run_data["document_id"],
            "operation": run_data["operation"],
            "status": run_data.get("status", "completed"),
            "user_id": user_id,
            "llamacloud_job_id": run_data.get("llamacloud_job_id"),
            "input": input_str,
            "output": output_str,
            "error": run_data.get("error"),
            "created_at": now
        }

        try:
            res = client.table("document_processing_runs").insert(record).execute()
            return res.data[0] if res.data else record
        except Exception as e:
            print(f"[REPOSITORY] Insert run warning: {e}")
            try:
                record_no_user = {k: v for k, v in record.items() if k != "user_id"}
                res = client.table("document_processing_runs").insert(record_no_user).execute()
                return res.data[0] if res.data else record
            except Exception:
                return record

    @staticmethod
    def list_runs(document_id: Optional[str] = None, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        client = get_supabase_client()
        try:
            q = client.table("document_processing_runs").select("*").order("created_at", desc=True)
            if document_id:
                q = q.eq("document_id", document_id)
            if user_id and user_id != "default_user":
                try:
                    q = q.eq("user_id", user_id)
                except Exception:
                    pass
            res = q.execute()
            
            result = []
            if res.data:
                for d in res.data:
                    item = dict(d)
                    try:
                        item["input"] = json.loads(item["input"]) if isinstance(item.get("input"), str) else item.get("input", {})
                    except Exception:
                        pass
                    try:
                        item["output"] = json.loads(item["output"]) if isinstance(item.get("output"), str) else item.get("output", {})
                    except Exception:
                        pass
                    result.append(item)
            return result
        except Exception as e:
            print(f"[REPOSITORY] List runs warning (Supabase table check): {e}")
            return []
