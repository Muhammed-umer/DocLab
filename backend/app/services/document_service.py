import os
import uuid
from typing import List, Dict, Any, Optional
from backend.app.supabase.repository import Repository
from backend.app.supabase.storage import StorageManager

class DocumentService:
    @staticmethod
    def upload_document(file_name: str, file_type: str, file_size: int, content: bytes, user_id: str = "default_user") -> Dict[str, Any]:
        file_id = str(uuid.uuid4())
        storage_path, local_path = StorageManager.upload_file(file_name, content, file_id)
        
        doc_data = {
            "id": file_id,
            "filename": file_name,
            "storage_path": storage_path,
            "file_type": file_type,
            "file_size": file_size,
            "status": "uploaded"
        }
        
        created = Repository.create_document(doc_data, user_id=user_id)
        return created

    @staticmethod
    def list_documents(user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return Repository.list_documents(user_id=user_id)

    @staticmethod
    def get_document(doc_id: str) -> Optional[Dict[str, Any]]:
        return Repository.get_document(doc_id)

    @staticmethod
    def delete_document(doc_id: str) -> bool:
        return Repository.delete_document(doc_id)
