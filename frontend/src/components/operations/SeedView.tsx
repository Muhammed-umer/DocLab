"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Sprout, Play, Database, CheckCircle2, Clock, Info } from "lucide-react";

interface SeedViewProps {
  document: DocumentRecord;
  onRunSeed: (seedText: string, seedCategory?: string) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const SeedView: React.FC<SeedViewProps> = ({ document, onRunSeed, isLoading, result }) => {
  const [seedText, setSeedText] = useState(
    "Project Deadline: Q4 2026. Lead Architect: LlamaIndex Core Team."
  );
  const [seedCategory, setSeedCategory] = useState("metadata_override");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seedText.trim()) return;
    onRunSeed(seedText, seedCategory);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#D9531E]" />
            LlamaIndex TextNode Vector Seeding
          </h3>
          <p className="text-xs text-[#6B6B66] mt-0.5">
            Injects an explicit LlamaIndex <code className="font-mono text-[#D9531E]">TextNode</code> directly into the active <code className="font-mono text-[#D9531E]">VectorStoreIndex</code> context using <code className="font-mono text-[#D9531E]">index.insert_nodes()</code>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-[11px] font-mono text-[#6B6B66] mb-1">Seed Fact / Context</label>
            <input
              type="text"
              value={seedText}
              onChange={(e) => setSeedText(e.target.value)}
              placeholder="Enter seed text or metadata to inject..."
              className="w-full p-2 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] focus:outline-none focus:border-[#D9531E]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-[#6B6B66] mb-1">Seed Category Tag</label>
            <input
              type="text"
              value={seedCategory}
              onChange={(e) => setSeedCategory(e.target.value)}
              placeholder="e.g. metadata_override"
              className="w-full p-2 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !seedText.trim()}
            className="px-4 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Seeding Nodes..." : "Inject Seed Node"}</span>
          </button>
        </div>
      </form>

      {/* Seed Results */}
      {result && (
        <div className="p-5 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2A7E43]" />
              <span className="text-xs font-bold font-mono text-[#171717]">
                Node Injected into VectorStoreIndex
              </span>
            </div>
            <span className="text-xs font-mono text-[#6B6B66] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#999992]" />
              {result.elapsed_seconds}s
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-[11px] text-[#6B6B66] block mb-1">Seeded Node ID</span>
              <div className="p-2 rounded bg-[#FAF9F6] border border-[#E7E5DF] text-[#171717]">
                {result.seeded_node_id}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#6B6B66] block mb-1">LlamaIndex Mechanism</span>
              <div className="p-2 rounded bg-[#FAF9F6] border border-[#E7E5DF] text-[#2A7E43]">
                {result.mechanism}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-[#6B6B66] block mb-1">Metadata Structure</span>
              <pre className="p-2 rounded bg-[#FAF9F6] border border-[#E7E5DF] text-[10px] text-[#171717]">
                {JSON.stringify(result.seed_metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
