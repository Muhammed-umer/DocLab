"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Wrench, Play, ArrowDown, FileText, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

interface RectifyViewProps {
  document: DocumentRecord;
  onRunRectify: (originalStatement: string) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const RectifyView: React.FC<RectifyViewProps> = ({
  document,
  onRunRectify,
  isLoading,
  result,
}) => {
  const [originalStatement, setOriginalStatement] = useState(
    "The project was built exclusively in Python."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalStatement.trim()) return;
    onRunRectify(originalStatement);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-3">
        <label className="text-xs font-semibold font-mono text-[#171717] flex items-center gap-2">
          <Wrench className="w-4 h-4 text-[#D9531E]" />
          Rectify Statement Against Document Evidence
        </label>
        <p className="text-xs text-[#6B6B66]">
          Corrects conflicting or inaccurate claims by aligning them with verifiable document evidence.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={originalStatement}
            onChange={(e) => setOriginalStatement(e.target.value)}
            placeholder="Enter original claim to rectify..."
            className="flex-1 p-2.5 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] focus:outline-none focus:border-[#D9531E]"
          />
          <button
            type="submit"
            disabled={isLoading || !originalStatement.trim()}
            className="px-4 py-2.5 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Rectifying..." : "Rectify Statement"}</span>
          </button>
        </div>
      </form>

      {/* 3-Stage Visual Rectification Comparison */}
      {result && (
        <div className="space-y-4">
          <div className="text-xs font-mono text-[#6B6B66] uppercase tracking-wider">
            3-Stage Rectification Pipeline Output
          </div>

          {/* STAGE 1: Original Statement */}
          <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B66]">
              <span className="font-semibold text-[#171717]">STAGE 1: ORIGINAL STATEMENT</span>
              <span className="text-[#C53030]">Unverified / Subject to Correction</span>
            </div>
            <p className="text-xs font-mono text-[#171717] bg-[#FFF5F5] p-3 rounded border border-[#FEB2B2]">
              "{result.original_statement}"
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-[#D9531E]" />
          </div>

          {/* STAGE 2: Document Evidence */}
          <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B66]">
              <span className="font-semibold text-[#171717]">STAGE 2: RETRIEVED DOCUMENT EVIDENCE</span>
              <span className="text-[#2A7E43]">Factual Ground Truth</span>
            </div>
            <p className="text-xs font-mono text-[#171717] bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF] whitespace-pre-wrap">
              {result.evidence}
            </p>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-[#D9531E]" />
          </div>

          {/* STAGE 3: Rectified Result */}
          <div className="p-4 rounded-lg border border-[#2A7E43]/40 bg-[#F0F9F2] shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#2A7E43]">
              <span className="font-bold">STAGE 3: RECTIFIED STATEMENT</span>
              <span className="flex items-center gap-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Corrected Result
              </span>
            </div>
            <p className="text-xs font-mono text-[#171717] bg-white p-3 rounded border border-[#2A7E43]/30 font-semibold leading-relaxed">
              {result.rectified_result}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
