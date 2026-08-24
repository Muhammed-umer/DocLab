"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Sliders, Play, ArrowRight, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";

interface RefineViewProps {
  document: DocumentRecord;
  onRunRefine: (originalResult: string, refinementInstruction: string) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const RefineView: React.FC<RefineViewProps> = ({
  document,
  onRunRefine,
  isLoading,
  result,
}) => {
  const [originalResult, setOriginalResult] = useState(
    "The document describes an AI software project."
  );
  const [instruction, setInstruction] = useState(
    "Make the answer more precise, technical, and include core technologies."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalResult.trim() || !instruction.trim()) return;
    onRunRefine(originalResult, instruction);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D9531E]" />
            LlamaIndex Response Refinement Synthesizer
          </h3>
          <p className="text-xs text-[#6B6B66] mt-0.5">
            Demonstrates LlamaIndex's signature <code className="font-mono text-[#D9531E]">ResponseMode.REFINE</code> synthesizer for iterative response enhancement.
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-[#6B6B66] mb-1">
              Original Result / Draft Answer
            </label>
            <textarea
              rows={2}
              value={originalResult}
              onChange={(e) => setOriginalResult(e.target.value)}
              className="w-full p-2 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] font-mono focus:outline-none focus:border-[#D9531E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#6B6B66] mb-1">
              Refinement Instruction Prompt
            </label>
            <input
              type="text"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Make answer concise and include specific metrics..."
              className="w-full p-2 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs text-[#171717] focus:outline-none focus:border-[#D9531E]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !originalResult.trim() || !instruction.trim()}
            className="px-4 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Refining..." : "Refine Response"}</span>
          </button>
        </div>
      </form>

      {/* Side-by-Side Comparison */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#6B6B66]">
            <span>BEFORE / AFTER REFINEMENT COMPARISON</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#999992]" />
              {result.elapsed_seconds}s
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left: Original */}
            <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs space-y-2">
              <div className="text-[11px] font-mono font-semibold text-[#6B6B66] uppercase tracking-wider border-b border-[#F0EEE9] pb-2">
                ORIGINAL DRAFT
              </div>
              <p className="text-xs text-[#6B6B66] leading-relaxed font-mono whitespace-pre-wrap bg-[#FAF9F6] p-3 rounded border border-[#E7E5DF]">
                {result.original_result}
              </p>
            </div>

            {/* Right: Refined */}
            <div className="p-4 rounded-lg border border-[#D9531E]/30 bg-white shadow-2xs space-y-2">
              <div className="text-[11px] font-mono font-bold text-[#D9531E] uppercase tracking-wider border-b border-[#D9531E]/20 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  REFINED RESULT
                </span>
                <span className="text-[10px] text-[#2A7E43]">✓ Enhanced</span>
              </div>
              <p className="text-xs text-[#171717] leading-relaxed font-mono whitespace-pre-wrap bg-[#FDF3EE] p-3 rounded border border-[#D9531E]/20 font-medium">
                {result.refined_result}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
