# LlamaIndex Concept Mapping Guide

This document maps all **9 LlamaIndex concepts** implemented in **LlamaIndex Lab** directly to their official LlamaIndex primitives, classes, and backend Python handlers.

---

## 1. Extract (Structured Information Extraction)
- **Official LlamaIndex Primitive**: `PromptTemplate` / `PydanticProgram` / `structured_predict`
- **Implementation File**: [`backend/app/services/extraction_service.py`](file:///d:/Projects/DocLab/backend/app/services/extraction_service.py)
- **Concept Explanation**: Given document text nodes, schema fields (e.g. `title`, `author`, `date`, `organization`, `important_entities`) are passed to the configured LLM with schema guidance to output structured JSON representations while preserving evidence node links.

---

## 2. Parse (Node Parsing & Chunking)
- **Official LlamaIndex Primitive**: `SentenceSplitter` / `NodeParser` / `TextNode` / `DocumentLoader`
- **Implementation File**: [`backend/app/services/parsing_service.py`](file:///d:/Projects/DocLab/backend/app/services/parsing_service.py)
- **Concept Explanation**: Reads PDF, DOCX, or TXT into `Document` objects and uses `SentenceSplitter` with customizable `chunk_size` and `chunk_overlap` to decompose documents into `TextNode` instances with attached metadata (page numbers, document IDs, node IDs).

---

## 3. Classify (Document Categorization)
- **Official LlamaIndex Primitive**: `LLM.complete()` / `PromptTemplate` with classification taxonomy
- **Implementation File**: [`backend/app/services/classification_service.py`](file:///d:/Projects/DocLab/backend/app/services/classification_service.py)
- **Concept Explanation**: Analyzes initial node content against a document taxonomy (Resume, Invoice, Research Paper, Legal Document, Technical Document, etc.), producing a category tag, detailed reasoning, and supporting node citations.

---

## 4. Index (Vector Store Indexing)
- **Official LlamaIndex Primitive**: `VectorStoreIndex`
- **Implementation File**: [`backend/app/services/indexing_service.py`](file:///d:/Projects/DocLab/backend/app/services/indexing_service.py) & [`backend/app/llamaindex/index_manager.py`](file:///d:/Projects/DocLab/backend/app/llamaindex/index_manager.py)
- **Concept Explanation**: Generates dense vector embeddings for all document nodes using the configured embedding model (`OpenAIEmbedding`, `HuggingFaceEmbedding`, or `MockEmbedding`) and registers an in-memory `VectorStoreIndex`.

---

## 5. Retrieve (Retriever & Query Engine Synthesis)
- **Official LlamaIndex Primitive**: `index.as_retriever()` / `index.as_query_engine()` / `RetrieverQueryEngine`
- **Implementation File**: [`backend/app/services/retrieval_service.py`](file:///d:/Projects/DocLab/backend/app/services/retrieval_service.py)
- **Concept Explanation**: Performs dense vector retrieval on `VectorStoreIndex` to isolate Top-K relevant context nodes (with similarity scores), followed by LLM synthesis to generate grounded answers with cited evidence.

---

## 6. Verify (Fact & Claim Verification)
- **Official LlamaIndex Primitive**: LlamaIndex Retriever + Verification Evaluator Prompt
- **Implementation File**: [`backend/app/services/verification_service.py`](file:///d:/Projects/DocLab/backend/app/services/verification_service.py)
- **Concept Explanation**: Retrieves factual context nodes for a given claim and evaluates factual alignment, returning `SUPPORTED`, `NOT SUPPORTED`, or `UNCERTAIN` ("Insufficient evidence").

---

## 7. Seed (Context & Node Seeding)
- **Official LlamaIndex Primitive**: `VectorStoreIndex.insert_nodes()` / `TextNode`
- **Implementation File**: [`backend/app/services/seed_service.py`](file:///d:/Projects/DocLab/backend/app/services/seed_service.py)
- **Concept Explanation**: Creates custom `TextNode` seed context containing user facts/metadata and uses `index.insert_nodes()` to dynamically inject it into the active index pipeline.

---

## 8. Rectify (Fact Rectification)
- **Official LlamaIndex Primitive**: Retrieval Context Engine + Rectification Pipeline
- **Implementation File**: [`backend/app/services/rectification_service.py`](file:///d:/Projects/DocLab/backend/app/services/rectification_service.py)
- **Concept Explanation**: Corrects inaccurate statements against document evidence in a 3-stage visual flow (Original Statement -> Retrieved Document Evidence -> Rectified Statement) without overwriting the original text.

---

## 9. Refine (Response Synthesizer Refinement)
- **Official LlamaIndex Primitive**: `ResponseMode.REFINE` / `get_response_synthesizer`
- **Implementation File**: [`backend/app/services/refinement_service.py`](file:///d:/Projects/DocLab/backend/app/services/refinement_service.py)
- **Concept Explanation**: Applies iterative response refinement based on user refinement prompts and retrieved context nodes, displaying a side-by-side BEFORE / AFTER comparison.
