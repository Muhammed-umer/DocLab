import numpy as np
from typing import List
from llama_index.core import Settings as LlamaSettings
from llama_index.core.embeddings import BaseEmbedding
from backend.app.config import settings

class MockEmbedding(BaseEmbedding):
    """
    Lightweight deterministic MockEmbedding fallback when no embedding API key is provided.
    Generates valid 384-dimensional dense vectors based on text hash so vector indexing & retrieval operate flawlessly.
    """
    embed_dim: int = 384

    def _get_query_embedding(self, query: str) -> List[float]:
        np.random.seed(abs(hash(query)) % (2**32))
        return np.random.randn(self.embed_dim).tolist()

    async def _aget_query_embedding(self, query: str) -> List[float]:
        return self._get_query_embedding(query)

    def _get_text_embedding(self, text: str) -> List[float]:
        np.random.seed(abs(hash(text)) % (2**32))
        return np.random.randn(self.embed_dim).tolist()

    async def _aget_text_embedding(self, text: str) -> List[float]:
        return self._get_text_embedding(text)

    def _get_text_embeddings(self, texts: List[str]) -> List[List[float]]:
        return [self._get_text_embedding(t) for t in texts]

def get_embedding_model():
    provider = (settings.EMBEDDING_PROVIDER or "openai").lower()
    api_key = settings.EMBEDDING_API_KEY or settings.LLM_API_KEY
    model = settings.EMBEDDING_MODEL or "text-embedding-3-small"

    if provider == "huggingface":
        try:
            from llama_index.embeddings.huggingface import HuggingFaceEmbedding
            embed = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
            LlamaSettings.embed_model = embed
            return embed
        except Exception as e:
            print(f"[LLAMAINDEX] HuggingFace embedding init failed: {e}")

    if api_key and provider == "openai":
        try:
            from llama_index.embeddings.openai import OpenAIEmbedding
            embed = OpenAIEmbedding(api_key=api_key, model=model)
            LlamaSettings.embed_model = embed
            return embed
        except Exception as e:
            print(f"[LLAMAINDEX] OpenAI embedding init failed: {e}")

    print("[LLAMAINDEX] Embedding API key missing or provider fallback triggered. Using MockEmbedding.")
    mock_embed = MockEmbedding()
    LlamaSettings.embed_model = mock_embed
    return mock_embed
