from typing import Dict, List, Optional, Tuple
from llama_index.core import VectorStoreIndex, Document
from llama_index.core.schema import BaseNode
from backend.app.llamaindex.embeddings import get_embedding_model
from backend.app.llamaindex.llm import get_llm

# In-memory index registry keyed by document_id
_INDEX_STORE: Dict[str, VectorStoreIndex] = {}
_NODE_STORE: Dict[str, List[BaseNode]] = {}

class IndexManager:
    @staticmethod
    def set_nodes(document_id: str, nodes: List[BaseNode]):
        _NODE_STORE[document_id] = nodes

    @staticmethod
    def get_nodes(document_id: str) -> Optional[List[BaseNode]]:
        return _NODE_STORE.get(document_id)

    @staticmethod
    def build_index(document_id: str, nodes: List[BaseNode]) -> Tuple[VectorStoreIndex, float]:
        import time
        start_time = time.time()
        
        embed_model = get_embedding_model()
        llm = get_llm()
        
        # Build LlamaIndex VectorStoreIndex from nodes
        index = VectorStoreIndex(
            nodes=nodes,
            embed_model=embed_model,
        )
        
        elapsed = round(time.time() - start_time, 3)
        _INDEX_STORE[document_id] = index
        _NODE_STORE[document_id] = nodes
        return index, elapsed

    @staticmethod
    def get_index(document_id: str) -> Optional[VectorStoreIndex]:
        return _INDEX_STORE.get(document_id)

    @staticmethod
    def clear_index(document_id: str):
        if document_id in _INDEX_STORE:
            del _INDEX_STORE[document_id]
        if document_id in _NODE_STORE:
            del _NODE_STORE[document_id]
