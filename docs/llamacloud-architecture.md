# LlamaCloud Architecture & Service Mapping

This document details the cloud-native architecture of **DocLab** and maps each operation to its underlying **LlamaCloud** service, SDK class, and job lifecycle.

---

## 1. Cloud-Native Architecture Overview

```
                      USER
                        │
                        ▼
           NEXT.JS FRONTEND WORKBENCH
         (Light-First UI, Settings Modal)
                        │
                        │ HTTP REST API
                        ▼
             FASTAPI BACKEND (Python 3.13)
        (integrations/llamacloud / services)
                        │
                        ▼
                LLAMACLOUD SDK
   ┌────────────────────┼────────────────────┐
   │                    │                    │
  LlamaParse        LlamaExtract       LlamaCloudIndex
 (Cloud Parser)    (Cloud Schema)     (Managed Vector)
   │                    │                    │
   └────────────────────┼────────────────────┘
                        │
                        ▼
               LlamaCloudRetriever
             (Cloud Search Engine)
                        │
                        ▼
             SUPABASE PERSISTENCE
        (documents & processing_runs)
```

---

## 2. Feature Mapping & SDK Reference

### A. PARSE ➔ LlamaParse
- **SDK Import**: `from llama_cloud_services import LlamaParse`
- **Handler File**: [`backend/app/integrations/llamacloud/parse.py`](file:///d:/Projects/DocLab/backend/app/integrations/llamacloud/parse.py)
- **Job Lifecycle**: Submits uploaded document to LlamaParse cloud parsing service; polls status; returns page-by-page markdown output and job ID.

### B. EXTRACT ➔ LlamaExtract
- **SDK Import**: `from llama_cloud_services import LlamaExtract`
- **Handler File**: [`backend/app/integrations/llamacloud/extract.py`](file:///d:/Projects/DocLab/backend/app/integrations/llamacloud/extract.py)
- **Job Lifecycle**: Submits schema extraction job with target JSON properties; executes cloud extraction; returns structured JSON result.

### C. CLASSIFY ➔ LlamaCloud Classify
- **SDK Import**: `from backend.app.integrations.llamacloud.classify import LlamaCloudClassifyClient`
- **Handler File**: [`backend/app/integrations/llamacloud/classify.py`](file:///d:/Projects/DocLab/backend/app/integrations/llamacloud/classify.py)
- **Job Lifecycle**: Analyzes LlamaParse output against document taxonomy; assigns category tag, reasoning explanation, and cloud job ID.

### D. INDEX ➔ LlamaCloudIndex
- **SDK Import**: `from llama_cloud_services import LlamaCloudIndex`
- **Handler File**: [`backend/app/integrations/llamacloud/index.py`](file:///d:/Projects/DocLab/backend/app/integrations/llamacloud/index.py)
- **Job Lifecycle**: Registers a managed cloud index resource (`LlamaCloudIndex`) for the document.

### E. RETRIEVE ➔ LlamaCloudRetriever
- **SDK Import**: `from llama_cloud_services import LlamaCloudRetriever`
- **Handler File**: [`backend/app/integrations/llamacloud/retrieve.py`](file:///d:/Projects/DocLab/backend/app/integrations/llamacloud/retrieve.py)
- **Job Lifecycle**: Queries managed `LlamaCloudIndex` resource for top-K dense similarity search; returns retrieved text chunks with similarity scores.

### F. VERIFY, RECTIFY, REFINE, SEED ➔ DocLab Workflows
- **Workflows**: Fact Verification, Evidence Rectification, Iterative Response Refinement, and Node Seeding built around LlamaCloud context and retrieval APIs.

---

## 3. Explicit Configuration Enforcement

If `LLAMA_CLOUD_API_KEY` is missing or unconfigured, all cloud endpoints raise an explicit exception:

```
ValueError: LLAMA_CLOUD_API_KEY is not configured. Please set your LlamaCloud API Key in Settings.
```

No silent MockLLM or MockEmbedding fallbacks replace LlamaCloud.
