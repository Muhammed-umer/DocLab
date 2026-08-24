import os
from typing import Tuple
from backend.app.config import settings
from backend.app.supabase.client import get_supabase_client

class StorageManager:
    @staticmethod
    def upload_file(filename: str, content: bytes, file_id: str) -> Tuple[str, str]:
        """
        Uploads a file directly to Supabase Storage and maintains local copy for LlamaParse file reading.
        """
        sanitized_filename = f"{file_id}_{filename}"
        local_path = os.path.join(settings.STORAGE_DIR, sanitized_filename)
        
        # Save local copy for LlamaParse file reading
        with open(local_path, "wb") as f:
            f.write(content)

        client = get_supabase_client()
        bucket_name = settings.SUPABASE_BUCKET
        client.storage.from_(bucket_name).upload(
            path=sanitized_filename,
            file=content,
            file_options={"content-type": "application/octet-stream", "upsert": "true"}
        )
        remote_path = f"{bucket_name}/{sanitized_filename}"
        return remote_path, local_path

    @staticmethod
    def read_file(storage_path: str) -> bytes:
        filename = storage_path.split("/")[-1]
        local_path = os.path.join(settings.STORAGE_DIR, filename)
        if os.path.exists(local_path):
            with open(local_path, "rb") as f:
                return f.read()

        client = get_supabase_client()
        parts = storage_path.split("/", 1)
        bucket = parts[0]
        filepath = parts[1] if len(parts) > 1 else parts[0]
        return client.storage.from_(bucket).download(filepath)

    @staticmethod
    def get_local_path(storage_path: str, filename_hint: str, file_id: str) -> str:
        sanitized = f"{file_id}_{filename_hint}"
        local_path = os.path.join(settings.STORAGE_DIR, sanitized)
        if os.path.exists(local_path):
            return local_path
        
        content = StorageManager.read_file(storage_path)
        with open(local_path, "wb") as f:
            f.write(content)
        return local_path
