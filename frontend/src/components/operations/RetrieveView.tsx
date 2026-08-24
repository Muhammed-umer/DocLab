"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Search, Send, FileText, ArrowRight, CheckCircle2, Clock, Hash, Percent } from "lucide-react";

interface RetrieveViewProps {
  document: DocumentRecord;
  onRunRetrieve: (query: string, topK: number) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const RetrieveView: React.FC<RetrieveViewProps> = ({
  document,
  onRunRetrieve,
  isLoading,
  result,
}) => {
  const [query, setQuery] = useState("What are the main conclusions and key findings of this document?");
  const [topK, setTopK] = useState(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onRunRetrieve(query, topK);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Restrained Query Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold font-mono text-[#171717] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#D9531E]" />
            Ask LlamaIndex Vector Retriever
          </label>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B66]">
            <span>Top-K Nodes:</span>
            <select
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="p-1 border border-[#E7E5DF] rounded bg-[#FAF9F6] text-xs focus:outline-none focus:border-[#D9531E]"
            >
              <option value={2}>2 nodes</option>
              <option value={4}>4 nodes</option>
              <option value={6}>6 nodes</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about this document..."
            className="flex-1 p-2.5 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] placeholder-[#999992] focus:outline-none focus:border-[#D9531E] font-sans"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-4 py-2.5 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? "Retrieving..." : "Retrieve"}</span>
          </button>
        </div>
      </form>

      {/* Retrieval Pipeline Results */}
      {result && (
        <div className="space-y-6">
          {/* Synthesized Answer */}
          <div className="p-5 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-2">
              <h4 className="text-xs font-semibold font-mono text-[#171717] uppercase tracking-wider">
                Synthesized Answer (LlamaIndex QueryEngine)
              </h4>
              <span className="text-xs font-mono text-[#6B6B66] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#999992]" />
                {result.elapsed_seconds}s
              </span>
            </div>
            <p className="text-xs text-[#171717] leading-relaxed whitespace-pre-wrap font-sans">
              {result.answer}
            </p>
          </div>

          {/* Retrieved Context Nodes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#6B6B66]">
              <span>Retrieved Vector Context Nodes ({result.retrieved_nodes.length})</span>
              <span>QUESTION ➔ RETRIEVED NODES ➔ ANSWER</span>
            </div>

            <div className="space-y-3">
              {result.retrieved_nodes.map((node: any) => (
                <div
                  key={node.node_id}
                  className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono border-b border-[#F0EEE9] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#F2EFE9] text-[#171717] font-bold flex items-center justify-center text-[10px]">
                        #{node.rank}
                      </span>
                      <span className="font-semibold text-[#171717]">Node {node.node_id}</span>
                      <span className="px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E7E5DF] text-[11px]">
                        Page {node.page_label}
                      </span>
                    </div>

                    {node.similarity_score !== null && (
                      <div className="flex items-center gap-1 text-[#2A7E43] font-bold text-[11px]">
                        <Percent className="w-3.5 h-3.5" />
                        <span>Score: {(node.similarity_score * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-mono text-[#171717] leading-relaxed whitespace-pre-wrap bg-[#FAF9F6] p-3 rounded border border-[#F0EEE9]">
                    {node.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
