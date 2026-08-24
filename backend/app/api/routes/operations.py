from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from backend.app.schemas.operations import (
    ParseRequest, ExtractRequest, IndexRequest, RetrieveRequest,
    VerifyRequest, SeedRequest, RectifyRequest, RefineRequest, ProcessingRunResponse
)
from backend.app.services.document_service import DocumentService
from backend.app.services.parsing_service import ParsingService
from backend.app.services.extraction_service import ExtractionService
from backend.app.services.classification_service import ClassificationService
from backend.app.services.indexing_service import IndexingService
from backend.app.services.retrieval_service import RetrievalService
from backend.app.services.verification_service import VerificationService
from backend.app.services.seed_service import SeedService
from backend.app.services.rectification_service import RectificationService
from backend.app.services.refinement_service import RefinementService
from backend.app.supabase.repository import Repository

router = APIRouter(prefix="/documents", tags=["LlamaIndex Operations"])

def _ensure_document_exists(document_id: str):
    doc = DocumentService.get_document(document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{document_id}' not found")
    return doc

# Route /runs/all MUST be defined before /{document_id} parameter routes
@router.get("/runs/all", response_model=List[ProcessingRunResponse])
def get_all_runs():
    return Repository.list_runs()

@router.post("/{document_id}/parse")
def parse_document(document_id: str, req: ParseRequest = ParseRequest()):
    _ensure_document_exists(document_id)
    try:
        return ParsingService.parse_document(document_id, req.chunk_size, req.chunk_overlap)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parse operation failed: {str(e)}")

@router.post("/{document_id}/extract")
def extract_information(document_id: str, req: ExtractRequest = ExtractRequest()):
    _ensure_document_exists(document_id)
    try:
        return ExtractionService.extract_information(document_id, req.fields)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extract operation failed: {str(e)}")

@router.post("/{document_id}/classify")
def classify_document(document_id: str):
    _ensure_document_exists(document_id)
    try:
        return ClassificationService.classify_document(document_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classify operation failed: {str(e)}")

@router.post("/{document_id}/index")
def create_or_rebuild_index(document_id: str, req: IndexRequest = IndexRequest()):
    _ensure_document_exists(document_id)
    try:
        return IndexingService.build_index(document_id, req.force_rebuild)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Index operation failed: {str(e)}")

@router.post("/{document_id}/retrieve")
def retrieve_and_query(document_id: str, req: RetrieveRequest):
    _ensure_document_exists(document_id)
    try:
        return RetrievalService.retrieve_and_query(document_id, req.query, req.top_k)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieve operation failed: {str(e)}")

@router.post("/{document_id}/verify")
def verify_claim(document_id: str, req: VerifyRequest):
    _ensure_document_exists(document_id)
    try:
        return VerificationService.verify_claim(document_id, req.claim)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verify operation failed: {str(e)}")

@router.post("/{document_id}/seed")
def seed_nodes(document_id: str, req: SeedRequest):
    _ensure_document_exists(document_id)
    try:
        return SeedService.seed_nodes_into_index(document_id, req.seed_text, req.seed_category)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seed operation failed: {str(e)}")

@router.post("/{document_id}/rectify")
def rectify_statement(document_id: str, req: RectifyRequest):
    _ensure_document_exists(document_id)
    try:
        return RectificationService.rectify_statement(document_id, req.original_statement)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rectify operation failed: {str(e)}")

@router.post("/{document_id}/refine")
def refine_response(document_id: str, req: RefineRequest):
    _ensure_document_exists(document_id)
    try:
        return RefinementService.refine_response(
            document_id, req.original_result, req.refinement_instruction, req.query_context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refine operation failed: {str(e)}")

@router.get("/{document_id}/runs", response_model=List[ProcessingRunResponse])
def get_document_runs(document_id: str):
    _ensure_document_exists(document_id)
    return Repository.list_runs(document_id)
