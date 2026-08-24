"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { CheckSquare, Play, FileText, CheckCircle2, XCircle, HelpCircle, Clock } from "lucide-react";

interface VerifyViewProps {
  document: DocumentRecord;
  onRunVerify: (claim: string) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const VerifyView: React.FC<VerifyViewProps> = ({ document, onRunVerify, isLoading, result }) => {
  const [claim, setClaim] = useState("The document explicitly mentions Python and FastAPI.");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim()) return;
    onRunVerify(claim);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUPPORTED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#F0F9F2] text-[#2A7E43] border border-[#2A7E43]/30 font-mono text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>SUPPORTED</span>
          </div>
        );
      case "NOT SUPPORTED":
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#FFF5F5] text-[#C53030] border border-[#C53030]/30 font-mono text-xs font-bold">
            <XCircle className="w-4 h-4" />
            <span>NOT SUPPORTED</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#FEF7EC] text-[#B46C00] border border-[#B46C00]/30 font-mono text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>UNCERTAIN (Insufficient Evidence)</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-3">
        <label className="text-xs font-semibold font-mono text-[#171717] flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#D9531E]" />
          Verify Fact / Claim Against Document Evidence
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Enter a claim to verify (e.g. 'The project was completed in 2025')"
            className="flex-1 p-2.5 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] placeholder-[#999992] focus:outline-none focus:border-[#D9531E]"
          />
          <button
            type="submit"
            disabled={isLoading || !claim.trim()}
            className="px-4 py-2.5 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Verifying..." : "Verify Claim"}</span>
          </button>
        </div>
      </form>

      {/* Verification Result */}
      {result && (
        <div className="space-y-4">
          <div className="p-5 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3">
              <div>
                <span className="text-[11px] font-mono text-[#6B6B66] block mb-1 uppercase tracking-wider">
                  Target Claim
                </span>
                <p className="text-sm font-medium text-[#171717]">{result.claim}</p>
              </div>
              {getStatusBadge(result.status)}
            </div>

            <div>
              <h4 className="text-xs font-semibold font-mono text-[#171717] mb-1">
                Factual Explanation
              </h4>
              <p className="text-xs text-[#6B6B66] leading-relaxed bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF]">
                {result.explanation}
              </p>
            </div>

            {/* Evidence Snippet */}
            {result.evidence && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B6B66]">
                  <span>Supporting Quote / Evidence</span>
                  {result.page_label && <span>Page {result.page_label}</span>}
                </div>
                <div className="p-3 rounded bg-[#FAF9F6] border border-[#E7E5DF] text-xs font-mono text-[#171717]">
                  "{result.evidence}"
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
