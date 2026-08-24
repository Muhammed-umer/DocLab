"use client";

import React, { useState } from "react";
import { ProcessingRun } from "@/lib/api";
import { Terminal, Clock, ChevronRight, Copy, Check, Cloud } from "lucide-react";

interface ExecutionInspectorProps {
  runs: ProcessingRun[];
  activeRun: ProcessingRun | null;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const ExecutionInspector: React.FC<ExecutionInspectorProps> = ({
  runs,
  activeRun,
  isOpen,
  onToggleOpen,
}) => {
  const [activeTab, setActiveTab] = useState<"output" | "input" | "evidence">("output");
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed right-0 top-20 z-40 bg-[#171717] text-white p-2 rounded-l-md text-xs font-mono flex items-center gap-1.5 shadow-md hover:bg-[#2A2A2A] transition-colors cursor-pointer"
        title="Open Execution Inspector"
      >
        <Terminal className="w-4 h-4 text-[#D9531E]" />
        <span>Inspector</span>
      </button>
    );
  }

  const runToDisplay = activeRun || runs[0];

  const handleCopy = (data: any) => {
    const text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-80 border-l border-[#E7E5DF] bg-[#FAF9F6] flex flex-col h-full shrink-0">
      {/* Top Bar */}
      <div className="p-3 border-b border-[#E7E5DF] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#D9531E]" />
          <h3 className="text-xs font-semibold text-[#171717] font-mono">
            Execution Inspector
          </h3>
        </div>
        <button
          onClick={onToggleOpen}
          className="p-1 text-[#6B6B66] hover:text-[#171717] rounded hover:bg-[#F2EFE9] transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Inspector Body */}
      {runToDisplay ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Metadata Card */}
          <div className="p-4 border-b border-[#E7E5DF] bg-white space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-[#171717]">
                RUN #{runToDisplay.id.slice(-6).toUpperCase()}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  runToDisplay.status === "completed"
                    ? "bg-[#F0F9F2] text-[#2A7E43]"
                    : "bg-[#FFF5F5] text-[#C53030]"
                }`}
              >
                {runToDisplay.status.toUpperCase()}
              </span>
            </div>

            <div className="p-2.5 rounded bg-[#FDF3EE] border border-[#D9531E]/20 font-mono text-xs space-y-1">
              <div className="flex items-center justify-between text-[#D9531E] font-bold">
                <span className="flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 fill-current" />
                  Provider: LlamaCloud
                </span>
                <span className="text-[10px] text-[#6B6B66]">
                  {runToDisplay.output?.service || runToDisplay.operation.toUpperCase()}
                </span>
              </div>
              {runToDisplay.llamacloud_job_id && (
                <div className="text-[10px] text-[#6B6B66]">
                  Job ID: <span className="text-[#171717] font-semibold">{runToDisplay.llamacloud_job_id}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#6B6B66]">
              <div>
                <span className="block text-[10px] text-[#999992]">OPERATION</span>
                <span className="font-semibold text-[#171717]">
                  {runToDisplay.operation.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-[#999992]">TIMESTAMP</span>
                <span>
                  {new Date(runToDisplay.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Inspector Tabs */}
          <div className="flex border-b border-[#E7E5DF] bg-white text-[11px] font-mono">
            <button
              onClick={() => setActiveTab("output")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "output"
                  ? "border-[#D9531E] text-[#171717] font-semibold"
                  : "border-transparent text-[#6B6B66] hover:bg-[#F2EFE9]"
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab("input")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "input"
                  ? "border-[#D9531E] text-[#171717] font-semibold"
                  : "border-transparent text-[#6B6B66] hover:bg-[#F2EFE9]"
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveTab("evidence")}
              className={`flex-1 py-2 text-center border-b-2 transition-colors ${
                activeTab === "evidence"
                  ? "border-[#D9531E] text-[#171717] font-semibold"
                  : "border-transparent text-[#6B6B66] hover:bg-[#F2EFE9]"
              }`}
            >
              Evidence
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 min-h-0 relative">
            <button
              onClick={() =>
                handleCopy(
                  activeTab === "output"
                    ? runToDisplay.output
                    : activeTab === "input"
                    ? runToDisplay.input
                    : runToDisplay.output?.retrieved_nodes || runToDisplay.output?.evidence
                )
              }
              className="absolute right-4 top-4 p-1 rounded border border-[#E7E5DF] bg-white text-[#6B6B66] hover:text-[#171717] transition-colors"
              title="Copy payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2A7E43]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {activeTab === "output" && (
              <pre className="text-[11px] font-mono text-[#171717] whitespace-pre-wrap bg-white p-3 rounded border border-[#E7E5DF] overflow-x-auto leading-relaxed">
                {typeof runToDisplay.output === "object"
                  ? JSON.stringify(runToDisplay.output, null, 2)
                  : String(runToDisplay.output)}
              </pre>
            )}

            {activeTab === "input" && (
              <pre className="text-[11px] font-mono text-[#171717] whitespace-pre-wrap bg-white p-3 rounded border border-[#E7E5DF] overflow-x-auto leading-relaxed">
                {typeof runToDisplay.input === "object"
                  ? JSON.stringify(runToDisplay.input, null, 2)
                  : String(runToDisplay.input)}
              </pre>
            )}

            {activeTab === "evidence" && (
              <div className="space-y-2 text-xs font-mono">
                {runToDisplay.output?.retrieved_nodes ? (
                  runToDisplay.output.retrieved_nodes.map((n: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded bg-white border border-[#E7E5DF] space-y-1">
                      <div className="flex justify-between text-[10px] text-[#6B6B66]">
                        <span>Node #{n.rank || idx + 1}</span>
                        <span>Page {n.page_label}</span>
                      </div>
                      <p className="text-[#171717] text-[11px]">{n.text}</p>
                    </div>
                  ))
                ) : runToDisplay.output?.evidence ? (
                  <div className="p-2.5 rounded bg-white border border-[#E7E5DF] text-[#171717]">
                    {runToDisplay.output.evidence}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-[#6B6B66]">
                    No evidence nodes attached to this run.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-[#6B6B66]">
          No execution runs recorded yet.
        </div>
      )}

      {/* Execution History Feed */}
      <div className="p-3 border-t border-[#E7E5DF] bg-white h-48 overflow-y-auto space-y-1 text-xs font-mono shrink-0">
        <div className="text-[10px] font-semibold text-[#999992] uppercase tracking-wider mb-2">
          Run History Log
        </div>
        {runs.map((r) => (
          <div
            key={r.id}
            onClick={() => {}}
            className={`p-2 rounded flex items-center justify-between text-[11px] border cursor-pointer ${
              r.id === runToDisplay?.id
                ? "bg-[#F2EFE9] border-[#E7E5DF] font-semibold text-[#171717]"
                : "bg-white border-[#F0EEE9] text-[#6B6B66] hover:bg-[#FAF9F6]"
            }`}
          >
            <span className="truncate max-w-[120px] text-[#D9531E]">
              {r.operation.toUpperCase()}
            </span>
            <span className="text-[10px] text-[#999992]">
              {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
};
