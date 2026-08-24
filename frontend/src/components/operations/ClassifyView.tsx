"use client";

import React from "react";
import { DocumentRecord } from "@/lib/api";
import { Play, Tag, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface ClassifyViewProps {
  document: DocumentRecord;
  onRunClassify: () => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const ClassifyView: React.FC<ClassifyViewProps> = ({
  document,
  onRunClassify,
  isLoading,
  result,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Control */}
      <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D9531E]" />
              Document Categorization & Intent Classification
            </h3>
            <p className="text-xs text-[#6B6B66] mt-0.5">
              Analyzes document semantics to determine classification category with supporting evidence.
            </p>
          </div>

          <button
            onClick={onRunClassify}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Classifying..." : "Classify Document"}</span>
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-4">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#6B6B66] mb-1">
                  Detected Category
                </div>
                <div className="text-lg font-bold text-[#171717] font-mono flex items-center gap-2">
                  <span className="px-3 py-1 rounded bg-[#D9531E]/10 text-[#D9531E] border border-[#D9531E]/20">
                    {result.category}
                  </span>
                </div>
              </div>

              {result.confidence !== null && result.confidence !== undefined && (
                <div className="text-right">
                  <div className="text-[11px] font-mono text-[#6B6B66] mb-1">Confidence Score</div>
                  <div className="text-base font-bold font-mono text-[#2A7E43]">
                    {(result.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-xs font-semibold font-mono text-[#171717] mb-1">
                Classification Explanation
              </h4>
              <p className="text-xs text-[#6B6B66] leading-relaxed bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF]">
                {result.explanation}
              </p>
            </div>
          </div>

          {/* Supporting Evidence Nodes */}
          {result.supporting_nodes && result.supporting_nodes.length > 0 && (
            <div className="p-4 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] space-y-3">
              <h4 className="text-xs font-semibold font-mono text-[#171717] uppercase tracking-wider">
                Supporting Node Passages
              </h4>
              <div className="space-y-2">
                {result.supporting_nodes.map((n: any, idx: number) => (
                  <div key={idx} className="p-3 rounded bg-white border border-[#E7E5DF] text-xs font-mono">
                    <div className="flex justify-between text-[11px] text-[#6B6B66] mb-1">
                      <span>Node ID: {n.node_id}</span>
                      <span>Page {n.page_label}</span>
                    </div>
                    <p className="text-[#171717]">{n.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
