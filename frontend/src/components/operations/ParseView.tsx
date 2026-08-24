"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Play, Layers, ChevronRight, ChevronDown, FileText, Clock, Cloud } from "lucide-react";

interface ParseViewProps {
  document: DocumentRecord;
  onRunParse: (chunkSize: number, chunkOverlap: number) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const ParseView: React.FC<ParseViewProps> = ({ document, onRunParse, isLoading, result }) => {
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [expandedPages, setExpandedPages] = useState<Record<number, boolean>>({ 1: true });

  const togglePage = (pageNo: number) => {
    setExpandedPages((prev) => ({ ...prev, [pageNo]: !prev[pageNo] }));
  };

  const pages = result?.pages || (result?.nodes ? result.nodes.map((n: any, idx: number) => ({
    page_number: idx + 1,
    text: n.text,
    metadata: n.metadata
  })) : []);

  const totalPages = result?.total_pages || result?.total_nodes || pages.length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Controls */}
      <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3 mb-4">
          <div>
            <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#D9531E]" />
              LlamaParse Cloud Parsing Pipeline
            </h3>
            <p className="text-xs text-[#6B6B66] mt-0.5">
              Parses PDF/DOCX/TXT into structured Markdown pages using <code className="font-mono text-[#D9531E]">LlamaParse</code>.
            </p>
          </div>

          <button
            onClick={() => onRunParse(chunkSize, chunkOverlap)}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Parsing via LlamaParse..." : "Run LlamaParse"}</span>
          </button>
        </div>

        {/* Pipeline Controls */}
        <div className="grid grid-cols-2 gap-6 text-xs">
          <div>
            <div className="flex justify-between mb-1 text-[11px] font-mono text-[#6B6B66]">
              <span>Chunk Size Target</span>
              <span className="font-bold text-[#171717]">{chunkSize} tokens</span>
            </div>
            <input
              type="range"
              min="128"
              max="2048"
              step="64"
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-[#D9531E] cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1 text-[11px] font-mono text-[#6B6B66]">
              <span>Chunk Overlap</span>
              <span className="font-bold text-[#171717]">{chunkOverlap} tokens</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={chunkOverlap}
              onChange={(e) => setChunkOverlap(Number(e.target.value))}
              className="w-full accent-[#D9531E] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visual Pipeline Banner */}
      <div className="p-4 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] font-mono text-xs flex items-center justify-around">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#D9531E]" />
          <span>DOCUMENT ({document.file_type.split("/")[1]?.toUpperCase() || "PDF"})</span>
        </div>
        <span className="text-[#999992]">➔</span>
        <div className="flex items-center gap-2 font-bold text-[#D9531E]">
          <Cloud className="w-4 h-4" />
          <span>LlamaParse Cloud</span>
        </div>
        <span className="text-[#999992]">➔</span>
        <div className="flex items-center gap-2 font-bold text-[#2A7E43]">
          <Layers className="w-4 h-4" />
          <span>{result ? `${totalPages} PAGES PARSED` : "-- PAGES"}</span>
        </div>
      </div>

      {/* Output Results Cards */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#6B6B66]">
            <span>LlamaParse Output ({totalPages} Pages)</span>
            <div className="flex items-center gap-3">
              {result.job_id && (
                <span className="px-2 py-0.5 rounded bg-[#FDF3EE] text-[#D9531E] border border-[#D9531E]/20">
                  Job: {result.job_id}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#999992]" />
                <span>{result.elapsed_seconds}s</span>
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {pages.map((p: any, idx: number) => {
              const pageNo = p.page_number || idx + 1;
              const isExpanded = Boolean(expandedPages[pageNo]);
              return (
                <div
                  key={pageNo}
                  className="border border-[#E7E5DF] rounded-md bg-white overflow-hidden shadow-2xs"
                >
                  <div
                    onClick={() => togglePage(pageNo)}
                    className="p-3 bg-[#FAF9F6] hover:bg-[#F2EFE9] flex items-center justify-between cursor-pointer border-b border-[#E7E5DF]"
                  >
                    <div className="flex items-center gap-2 font-mono text-xs">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#6B6B66]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#6B6B66]" />
                      )}
                      <span className="font-semibold text-[#171717]">
                        PAGE {String(pageNo).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#6B6B66]">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E7E5DF]">
                        {p.text?.length || 0} characters
                      </span>
                    </div>
                  </div>

                  {/* Body text preview */}
                  <div className="p-4 text-xs text-[#171717] leading-relaxed font-mono whitespace-pre-wrap bg-white border-b border-[#F0EEE9]">
                    {isExpanded ? p.text : `${p.text?.slice(0, 300)}...`}
                  </div>

                  {/* Metadata footer */}
                  {isExpanded && p.metadata && (
                    <div className="p-3 bg-[#FAF9F6] text-[11px] font-mono text-[#6B6B66] space-y-1">
                      <div className="font-semibold text-[#171717]">Page Metadata:</div>
                      <pre className="bg-white p-2 rounded border border-[#E7E5DF] overflow-x-auto text-[10px]">
                        {JSON.stringify(p.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
