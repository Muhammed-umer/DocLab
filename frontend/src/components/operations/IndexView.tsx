"use client";

import React from "react";
import { DocumentRecord } from "@/lib/api";
import { Play, Database, RefreshCw, Cpu, CheckCircle2, Clock, Layers } from "lucide-react";

interface IndexViewProps {
  document: DocumentRecord;
  onRunIndex: (forceRebuild: boolean) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const IndexView: React.FC<IndexViewProps> = ({ document, onRunIndex, isLoading, result }) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Control */}
      <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3 mb-4">
          <div>
            <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
              <Database className="w-4 h-4 text-[#D9531E]" />
              LlamaIndex VectorStoreIndex Pipeline
            </h3>
            <p className="text-xs text-[#6B6B66] mt-0.5">
              Embeds nodes using configured embedding model and creates an in-memory vector index.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRunIndex(false)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoading ? "Indexing..." : "Create Index"}</span>
            </button>

            <button
              onClick={() => onRunIndex(true)}
              disabled={isLoading}
              className="px-3 py-2 rounded border border-[#E7E5DF] bg-white text-xs font-medium text-[#171717] hover:bg-[#F2EFE9] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#6B6B66]" />
              <span>Rebuild Index</span>
            </button>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div className="p-4 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] font-mono text-xs flex items-center justify-around">
          <div className="text-center">
            <div className="text-[10px] text-[#6B6B66] mb-1">STAGE 1</div>
            <div className="font-semibold text-[#171717] flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#D9531E]" />
              <span>DOCUMENT</span>
            </div>
          </div>
          <span className="text-[#999992]">➔</span>
          <div className="text-center">
            <div className="text-[10px] text-[#6B6B66] mb-1">STAGE 2</div>
            <div className="font-semibold text-[#171717]">TEXT NODES</div>
          </div>
          <span className="text-[#999992]">➔</span>
          <div className="text-center">
            <div className="text-[10px] text-[#6B6B66] mb-1">STAGE 3</div>
            <div className="font-semibold text-[#171717]">EMBEDDINGS</div>
          </div>
          <span className="text-[#999992]">➔</span>
          <div className="text-center">
            <div className="text-[10px] text-[#6B6B66] mb-1">STAGE 4</div>
            <div className="font-semibold text-[#2A7E43] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7E43]" />
              <span>VECTOR INDEX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Index Metrics Status */}
      {result && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
            <div className="text-[11px] font-mono text-[#6B6B66] mb-1 uppercase tracking-wider">
              Index Type
            </div>
            <div className="text-base font-bold font-mono text-[#171717]">
              {result.index_type}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
            <div className="text-[11px] font-mono text-[#6B6B66] mb-1 uppercase tracking-wider">
              Indexed Nodes
            </div>
            <div className="text-base font-bold font-mono text-[#D9531E]">
              {result.total_nodes} nodes
            </div>
          </div>

          <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
            <div className="text-[11px] font-mono text-[#6B6B66] mb-1 uppercase tracking-wider">
              Embedding Model
            </div>
            <div className="text-xs font-bold font-mono text-[#171717] truncate">
              {result.embedding_model}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
