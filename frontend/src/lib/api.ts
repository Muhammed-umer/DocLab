const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "/api/py";
  }
  return "http://localhost:8000";
};

const API_BASE = getApiBase();

export interface DocumentRecord {
  id: string;
  filename: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  llamacloud_file_id?: string;
  llamacloud_job_id?: string;
  llamacloud_index_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessingRun {
  id: string;
  document_id: string;
  operation: string;
  status: string;
  llamacloud_job_id?: string;
  input: any;
  output: any;
  error?: string;
  created_at: string;
}

export interface SettingsStatus {
  has_llamacloud_key: boolean;
  llm_provider: string;
  llm_model: string;
  has_llm_key: boolean;
  embedding_provider: string;
  embedding_model: string;
  has_embedding_key: boolean;
  has_supabase: boolean;
  storage_dir: string;
}

export const api = {
  // Documents
  async listDocuments(): Promise<DocumentRecord[]> {
    const res = await fetch(`${getApiBase()}/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  async uploadDocument(file: File): Promise<DocumentRecord> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${getApiBase()}/documents/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "Upload failed");
    }
    return res.json();
  },

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`${getApiBase()}/documents/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete document");
  },

  // Operations
  async parseDocument(docId: string, chunkSize = 512, chunkOverlap = 50) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chunk_size: chunkSize, chunk_overlap: chunkOverlap }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Parse operation failed" }));
      throw new Error(err.detail || "Parse operation failed");
    }
    return res.json();
  },

  async extractDocument(docId: string, fields?: string[]) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/extract`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Extract operation failed" }));
      throw new Error(err.detail || "Extract operation failed");
    }
    return res.json();
  },

  async classifyDocument(docId: string) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/classify`, {
      method: "POST",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Classify operation failed" }));
      throw new Error(err.detail || "Classify operation failed");
    }
    return res.json();
  },

  async indexDocument(docId: string, forceRebuild = false) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/index`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force_rebuild: forceRebuild }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Index operation failed" }));
      throw new Error(err.detail || "Index operation failed");
    }
    return res.json();
  },

  async retrieveQuery(docId: string, query: string, topK = 4) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/retrieve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: topK }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Retrieve operation failed" }));
      throw new Error(err.detail || "Retrieve operation failed");
    }
    return res.json();
  },

  async verifyClaim(docId: string, claim: string) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Verify operation failed" }));
      throw new Error(err.detail || "Verify operation failed");
    }
    return res.json();
  },

  async seedNodes(docId: string, seedText: string, seedCategory = "user_seed") {
    const res = await fetch(`${getApiBase()}/documents/${docId}/seed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seed_text: seedText, seed_category: seedCategory }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Seed operation failed" }));
      throw new Error(err.detail || "Seed operation failed");
    }
    return res.json();
  },

  async rectifyStatement(docId: string, originalStatement: string) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/rectify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ original_statement: originalStatement }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Rectify operation failed" }));
      throw new Error(err.detail || "Rectify operation failed");
    }
    return res.json();
  },

  async refineResponse(docId: string, originalResult: string, refinementInstruction: string, queryContext?: string) {
    const res = await fetch(`${getApiBase()}/documents/${docId}/refine`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        original_result: originalResult,
        refinement_instruction: refinementInstruction,
        query_context: queryContext,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Refine operation failed" }));
      throw new Error(err.detail || "Refine operation failed");
    }
    return res.json();
  },

  async listRuns(docId?: string): Promise<ProcessingRun[]> {
    const base = getApiBase();
    const url = docId ? `${base}/documents/${docId}/runs` : `${base}/documents/runs/all`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch processing runs");
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SettingsStatus> {
    const res = await fetch(`${getApiBase()}/settings`);
    if (!res.ok) throw new Error("Failed to fetch settings");
    return res.json();
  },

  async updateSettings(payload: Partial<SettingsStatus> & { llama_cloud_api_key?: string; llm_api_key?: string; embedding_api_key?: string; supabase_url?: string; supabase_key?: string }) {
    const res = await fetch(`${getApiBase()}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update settings");
    return res.json();
  }
};
