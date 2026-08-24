from pydantic import BaseModel
from typing import Optional, List

class DocumentResponse(BaseModel):
    id: str
    filename: str
    storage_path: str
    file_type: str
    file_size: int
    status: str
    created_at: str
    updated_at: str

class DocumentListResponse(BaseModel):
    documents: List[DocumentResponse]
