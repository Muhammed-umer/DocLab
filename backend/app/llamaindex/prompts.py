from pydantic import BaseModel, Field
from typing import List, Optional

class DefaultExtractionSchema(BaseModel):
    title: Optional[str] = Field(default="", description="The primary title of the document")
    author: Optional[str] = Field(default="", description="Author or creator of the document")
    date: Optional[str] = Field(default="", description="Publication or creation date")
    organization: Optional[str] = Field(default="", description="Associated company, institute, or organization")
    important_entities: List[str] = Field(default_factory=list, description="Key entities, products, systems, or terms mentioned")

CLASSIFICATION_PROMPT = """
You are a senior document classification specialist.
Classify the following document content into EXACTLY ONE of these categories:
- Resume
- Invoice
- Research Paper
- Legal Document
- Medical Document
- Report
- Letter
- Technical Document
- Other

Document snippet:
{content}

Respond ONLY in valid JSON with this exact format:
{{
  "category": "<One of the categories above>",
  "explanation": "<Brief concise explanation supporting the category>",
  "confidence": <float between 0.0 and 1.0 based on clarity of content evidence>
}}
"""

VERIFICATION_PROMPT = """
You are a factual verification engine. Verify the claim against the provided document context.

Claim: {claim}

Document Context:
{context}

Status MUST be one of:
- SUPPORTED (if document evidence clearly supports the claim)
- NOT SUPPORTED (if document evidence directly contradicts the claim)
- UNCERTAIN (if document context lacks sufficient information)

Respond ONLY in valid JSON:
{{
  "status": "SUPPORTED" | "NOT SUPPORTED" | "UNCERTAIN",
  "explanation": "<Detailed factual explanation>",
  "evidence": "<Exact relevant quote or snippet from document context>"
}}
"""

RECTIFICATION_PROMPT = """
You are a precise document rectification engine.
Your task is to correct the provided original statement using verifiable document evidence.

Original Statement:
{original}

Document Evidence Context:
{context}

Provide a rectified statement that directly reflects the factual document evidence.
Preserve clarity and accuracy.
"""

REFINEMENT_PROMPT = """
You are a response refinement assistant.
Refine the original response according to the user's refinement instructions, incorporating any additional context provided.

Original Response:
{original_response}

Refinement Instruction:
{instruction}

Document Context:
{context}

Provide the refined response:
"""
