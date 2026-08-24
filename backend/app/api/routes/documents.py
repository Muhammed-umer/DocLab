from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from typing import List
from backend.app.schemas.documents import DocumentResponse, DocumentListResponse
from backend.app.services.document_service import DocumentService
from backend.app.api.auth import get_current_user_id

router = APIRouter(prefix="/documents", tags=["Documents"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename missing")

    filename = file.filename
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed extensions: PDF, DOCX, TXT"
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes)")

    created = DocumentService.upload_document(
        file_name=filename,
        file_type=file.content_type or "application/octet-stream",
        file_size=len(content),
        content=content,
        user_id=user_id
    )
    return created

@router.get("", response_model=List[DocumentResponse])
def list_documents(user_id: str = Depends(get_current_user_id)):
    return DocumentService.list_documents(user_id=user_id)

@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str):
    doc = DocumentService.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found")
    return doc

@router.delete("/{document_id}")
def delete_document(document_id: str):
    success = DocumentService.delete_document(document_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found")
    return {"message": f"Document '{document_id}' deleted successfully", "id": document_id}
