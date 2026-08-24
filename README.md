# DocLab — LlamaCloud Document Intelligence Playground

A functional, light-first developer workbench designed to gain practical experience with official **LlamaCloud** products (**LlamaParse**, **LlamaExtract**, **LlamaCloudIndex**, **LlamaCloudRetriever**) and Supabase persistence.

---

## 1. Official LlamaCloud Service Mapping

| Operation | Service / SDK Primitive | Description |
| :--- | :--- | :--- |
| **Parse** | `LlamaParse` | Real cloud document parsing returning markdown & page structures |
| **Extract** | `LlamaExtract` | Schema-guided cloud extraction returning structured JSON |
| **Classify** | LlamaCloud Classify | Document categorization and intent analysis |
| **Index** | `LlamaCloudIndex` | Managed cloud indexing & ingestion pipelines |
| **Retrieve** | `LlamaCloudRetriever` | Cloud vector retrieval returning grounded chunks with scores |
| **Verify** | DocLab Workflow | Claim verification using LlamaCloud retrieval |
| **Seed** | DocLab Workflow | Custom seed context ingestion into LlamaCloud index |
| **Rectify** | DocLab Workflow | Statement correction preserving original + cloud evidence |
| **Refine** | DocLab Workflow | Response refinement using LlamaCloud context |

---

## 2. Configuration & API Keys

Set your **LlamaCloud API Key** (`llx-...`) in `.env` or dynamically in the Web UI Settings Modal:

```env
LLAMA_CLOUD_API_KEY=llx-...
```

> [!IMPORTANT]
> **No Silent Mocks**: If `LLAMA_CLOUD_API_KEY` is not configured, the backend returns an explicit error (`"LLAMA_CLOUD_API_KEY is not configured."`) so you know exactly when LlamaCloud is being used.

---

## 3. Running Locally

### Backend (FastAPI + LlamaCloud)
```powershell
.\backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
```

### Frontend (Next.js 15 App Router)
```powershell
npm run dev --prefix frontend
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Documentation Links

- [`docs/llamacloud-architecture.md`](file:///d:/Projects/DocLab/docs/llamacloud-architecture.md) — Technical architecture reference.
- [`docs/llamaindex-concepts.md`](file:///d:/Projects/DocLab/docs/llamaindex-concepts.md) — Core concept reference.
