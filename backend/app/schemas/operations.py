from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict

class ParseRequest(BaseModel):
    chunk_size: int = Field(default=512, ge=64, le=4096)
    chunk_overlap: int = Field(default=50, ge=0, le=512)

class ExtractRequest(BaseModel):
    fields: Optional[List[str]] = Field(default=None, description="Custom field names to extract")

class IndexRequest(BaseModel):
    force_rebuild: bool = Field(default=False, description="Re-run parsing and rebuild vector index")

class RetrieveRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Question or search query for retriever")
    top_k: int = Field(default=4, ge=1, le=20)

class VerifyRequest(BaseModel):
    claim: str = Field(..., min_length=1, description="Claim or statement to verify against document evidence")

class SeedRequest(BaseModel):
    seed_text: str = Field(..., min_length=1, description="Seed text fact or context to inject into vector index")
    seed_category: Optional[str] = Field(default="user_seed")

class RectifyRequest(BaseModel):
    original_statement: str = Field(..., min_length=1, description="Original claim or statement to rectify against document evidence")

class RefineRequest(BaseModel):
    original_result: str = Field(..., min_length=1, description="Original answer or statement")
    refinement_instruction: str = Field(..., min_length=1, description="Instruction for refining the response")
    query_context: Optional[str] = Field(default=None)

class ProcessingRunResponse(BaseModel):
    id: str
    document_id: str
    operation: str
    status: str
    input: Any
    output: Any
    error: Optional[str] = None
    created_at: str
