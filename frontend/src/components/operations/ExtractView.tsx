"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { Play, Sparkles, Clock, Copy, Check } from "lucide-react";

interface ExtractViewProps {
  document: DocumentRecord;
  onRunExtract: (fields?: string[]) => Promise<any>;
  isLoading: boolean;
  result: any;
}

export const ExtractView: React.FC<ExtractViewProps> = ({ document, onRunExtract, isLoading, result }) => {
  const [customFields, setCustomFields] = useState(
    "title, author, role, experience, skills, organization"
  );
  const [activeTab, setActiveTab] = useState<"structured" | "raw">("structured");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    const fields = customFields.split(",").map((f) => f.trim()).filter(Boolean);
    onRunExtract(fields);
  };

  const structuredData = result?.extracted_result || result?.structured_result || result?.output || result;
  const rawText = result?.raw_result || JSON.stringify(structuredData, null, 2);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header & Controls */}
      <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-[#F0EEE9] pb-3 mb-4">
          <div>
            <h3 className="text-xs font-semibold text-[#171717] font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D9531E]" />
              Structured Schema-Guided Extraction
            </h3>
            <p className="text-xs text-[#6B6B66] mt-0.5">
              Uses <code className="font-mono text-[#D9531E]">LlamaExtract</code> cloud schema job to extract typed key-value properties.
            </p>
          </div>

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="px-4 py-2 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? "Extracting..." : "Run Extraction"}</span>
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-[#6B6B66] mb-1">
            Target JSON Schema Fields (Comma-separated)
          </label>
          <input
            type="text"
            value={customFields}
            onChange={(e) => setCustomFields(e.target.value)}
            placeholder="e.g. title, author, role, experience, skills"
            className="w-full p-2 bg-[#FAF9F6] border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
          />
        </div>
      </div>

      {/* Output Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 border-b border-[#E7E5DF] pb-2">
              <button
                onClick={() => setActiveTab("structured")}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                  activeTab === "structured"
                    ? "bg-[#171717] text-white font-medium"
                    : "text-[#6B6B66] hover:bg-[#F2EFE9]"
                }`}
              >
                Structured JSON
              </button>
              <button
                onClick={() => setActiveTab("raw")}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                  activeTab === "raw"
                    ? "bg-[#171717] text-white font-medium"
                    : "text-[#6B6B66] hover:bg-[#F2EFE9]"
                }`}
              >
                Raw LLM Output
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#6B6B66]">
              {result.job_id && (
                <span className="px-2 py-0.5 rounded bg-[#FDF3EE] text-[#D9531E] border border-[#D9531E]/20">
                  Job: {result.job_id}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#999992]" />
                {result.elapsed_seconds || 0.4}s
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(structuredData, null, 2))}
                className="flex items-center gap-1 px-2 py-1 rounded border border-[#E7E5DF] bg-white hover:bg-[#F2EFE9] text-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2A7E43]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          {activeTab === "structured" ? (
            <div className="p-4 rounded-lg border border-[#E7E5DF] bg-white font-mono text-xs overflow-x-auto shadow-2xs">
              <pre className="text-[#171717]">
                {JSON.stringify(structuredData, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-[#E7E5DF] bg-[#FAF9F6] font-mono text-xs whitespace-pre-wrap text-[#171717]">
              {rawText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
