from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.api.routes import documents, operations, settings as settings_route
from backend.app.llamaindex.llm import get_llm
from backend.app.llamaindex.embeddings import get_embedding_model

app = FastAPI(
    title="LlamaIndex Lab API",
    description="Document Intelligence Playground powered by LlamaIndex and FastAPI",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] Global exception caught: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers={"Access-Control-Allow-Origin": "*"}
    )

# Mount API Routers (Direct + Vercel Serverless Prefix)
app.include_router(documents.router)
app.include_router(operations.router)
app.include_router(settings_route.router)

app.include_router(documents.router, prefix="/api/py")
app.include_router(operations.router, prefix="/api/py")
app.include_router(settings_route.router, prefix="/api/py")

@app.on_event("startup")
def startup_event():
    print("[LLAMAINDEX LAB] Starting up Python FastAPI Backend...")
    print(f"[LLAMAINDEX LAB] LLM Provider: {settings.LLM_PROVIDER} ({settings.LLM_MODEL})")
    print(f"[LLAMAINDEX LAB] Embedding Provider: {settings.EMBEDDING_PROVIDER} ({settings.EMBEDDING_MODEL})")
    # Warm up LlamaIndex settings
    try:
        get_llm()
        get_embedding_model()
    except Exception as e:
        print(f"[LLAMAINDEX LAB] Warmup notice: {e}")

@app.get("/api/py/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "LlamaIndex Lab API",
        "llm_provider": settings.LLM_PROVIDER,
        "embedding_provider": settings.EMBEDDING_PROVIDER
    }
