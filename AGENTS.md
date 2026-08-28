# AGENTS.md — DocLab Project Reference & Agent Instructions

Welcome to **DocLab** (LlamaCloud Edition). This document serves as the authoritative system architecture, tech stack reference, and operational guide for AI agents (such as Google DeepMind's Antigravity) working within this repository.

---

## 1. Project Overview

**DocLab** is an interactive, full-stack Document Intelligence Laboratory & Execution Workbench built around **LlamaIndex** and **LlamaCloud** services. It provides a visual playground for testing, visualizing, and executing 9 core document processing primitives.

### Key Architecture Pillars
- **Single AI Engine Key**: All parsing, schema extraction, vector indexing, dense retrieval, and LLM completions are unified under a single **`LLAMA_CLOUD_API_KEY`**. No separate OpenAI or Gemini keys are required.
- **100% Cloud Persistence**: Document records and execution run histories are stored in **Supabase PostgreSQL**, while binary files reside in **Supabase Storage** (`document-lab` bucket). SQLite has been completely removed.
- **Multi-Tenant Security**: User authentication and multi-tenant document isolation are managed via **Clerk Authentication** (`@clerk/nextjs` frontend & JWT validation backend).
- **Vercel Serverless Ready**: Deployable natively on Vercel as a unified Next.js + FastAPI Serverless Python repository.

---

## 2. Technology Stack

### Frontend (`/frontend`)
- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Vanilla CSS / Tailwind CSS with modern minimalist design system tokens
- **Icons**: Lucide React (`lucide-react`)
- **Authentication**: `@clerk/nextjs` (`ClerkProvider`, `clerkMiddleware`, `<UserButton />`)

### Backend (`/backend`)
- **Framework**: Python 3.11+ FastAPI with Uvicorn ASGI server
- **AI Integrations**: `llama-cloud-services`, `llama-index-core`
- **Database Client**: `supabase-py` (Supabase PostgreSQL + Storage)
- **Validation**: Pydantic schemas (`backend/app/schemas`)

---

## 3. The 9 Document Intelligence Primitives

DocLab implements 9 distinct processing pipelines, accessible via tabs in the workbench UI:

| Primitive | Service / Integration | Description |
| :--- | :--- | :--- |
| **1. Parse** | `LlamaParse` | Converts PDF, DOCX, or TXT documents into page-by-page Markdown with structure & table preservation. |
| **2. Extract** | `LlamaExtract` | Pulls typed key-value properties (e.g. `title`, `author`, `skills`, `cgpa`, `email`) into structured JSON format. |
| **3. Classify** | LlamaCloud Classifier | Categorizes the document type (e.g., *Resume, Invoice, Legal Contract, Technical Paper*) and provides reasoning. |
| **4. Index** | `LlamaCloudIndex` | Ingests document nodes into a managed LlamaCloud dense vector store. |
| **5. Retrieve** | `LlamaCloudRetriever` | Conducts dense vector search over the indexed document to retrieve top-$k$ context nodes with similarity scores. |
| **6. Verify** | Grounded Verification Service | Fact-checks user claims against document context, evaluating claims as `SUPPORTED` or `UNCERTAIN` with node evidence. |
| **7. Seed** | Seed Ingestion Service | Injects custom user seed text or domain notes into the document's knowledge index. |
| **8. Rectify** | Rectification Engine | Corrects outdated or inaccurate statements using actual document evidence without mutating original files. |
| **9. Refine** | Refinement Pipeline | Iteratively polishes an initial LLM output based on document context and custom instructions. |

---

## 4. Directory Hierarchy

```text
DocLab/
├── AGENTS.md                   # This file (Agent reference & architectural context)
├── .env                        # Local backend environment variables (git-ignored)
├── .env.example                # Template environment variable schema
├── package.json                # Root monorepo scripts
├── vercel.json                 # Vercel deployment configuration
├── api/
│   └── index.py                # Root Vercel Python serverless entrypoint
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI application entrypoint & CORS middleware
│   │   ├── config.py           # Pydantic configuration loader
│   │   ├── api/
│   │   │   ├── auth.py         # Clerk JWT / User header dependency
│   │   │   └── routes/         # API endpoints (documents, operations, settings)
│   │   ├── integrations/
│   │   │   └── llamacloud/     # Central LlamaCloud integration client modules
│   │   │       ├── client.py   # LlamaCloud API Key validator
│   │   │       ├── parse.py    # LlamaParse integration
│   │   │       ├── extract.py  # LlamaExtract schema extraction
│   │   │       ├── classify.py # Document classifier
│   │   │       ├── index.py    # Managed index builder
│   │   │       └── retrieve.py # Dense retriever
│   │   ├── services/           # Service layer logic for all 9 primitives
│   │   └── supabase/           # Supabase repository & storage managers
│   └── requirements.txt        # Backend Python dependencies
└── frontend/
    ├── api/
    │   └── index.py            # Frontend Vercel Python serverless entrypoint
    ├── src/
    │   ├── app/                # Next.js App Router (layout, page, middleware)
    │   ├── components/         # Workbench UI (Header, DocumentLibrary, ExecutionInspector, operations/*)
    │   └── lib/                # API client (`api.ts`) & utility functions
    ├── requirements.txt        # Frontend Python serverless build requirements
    └── package.json            # Frontend Node dependencies & scripts
```

---

## 5. Environment Variables Reference

Add these keys to `.env` (backend) and Vercel Project Settings:

```env
# 1. LlamaCloud API Key (Required for all AI operations)
LLAMA_CLOUD_API_KEY=llx-...

# 2. Supabase Configuration (Required for Database & Storage)
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_BUCKET=document-lab

# 3. Clerk Authentication Configuration (Required for Multi-Tenant Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

---

## 6. Development & Operations Guidelines for Agents

When making code modifications to this repository, adhere strictly to the following conventions:

1. **API Key Uniformity**: Always route AI model requests through `LLAMA_CLOUD_API_KEY`. Do not require separate OpenAI or Gemini keys unless explicitly requested by the user.
2. **Database Integrity**: All document metadata operations must go through `Repository` in `backend/app/supabase/repository.py`. Never introduce SQLite or local state dependencies.
3. **Multi-Tenancy**: Maintain user-scoping by ensuring `user_id` is propagated through `Repository` methods.
4. **Vercel Rewrites**: Ensure `backend/app/main.py` maintains dual routing prefixes (both direct `/documents` and `/api/py/documents`) so serverless Vercel function calls match without 404s.
5. **Verification**: After modifying backend files, compile with `python -m py_compile backend/app/main.py`. For frontend changes, run `npm run build --prefix frontend`.
