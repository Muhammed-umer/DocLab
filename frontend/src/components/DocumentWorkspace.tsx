"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import {
  Sparkles, Layers, Tag, Database, Search, CheckSquare, Sprout, Wrench, Sliders,
  FileText, Loader2, CheckCircle2, ArrowRight
} from "lucide-react";
import { ParseView } from "./operations/ParseView";
import { ExtractView } from "./operations/ExtractView";
import { ClassifyView } from "./operations/ClassifyView";
import { IndexView } from "./operations/IndexView";
import { RetrieveView } from "./operations/RetrieveView";
import { VerifyView } from "./operations/VerifyView";
import { SeedView } from "./operations/SeedView";
import { RectifyView } from "./operations/RectifyView";
import { RefineView } from "./operations/RefineView";

export type OperationType =
  | "parse"
  | "extract"
  | "classify"
  | "index"
  | "retrieve"
  | "verify"
  | "seed"
  | "rectify"
  | "refine";

interface DocumentWorkspaceProps {
  document: DocumentRecord | null;
  activeOperation: OperationType;
  onSelectOperation: (op: OperationType) => void;
  isLoading: boolean;
  operationResults: Record<string, any>;
  onRunParse: (chunkSize: number, chunkOverlap: number) => Promise<any>;
  onRunExtract: (fields?: string[]) => Promise<any>;
  onRunClassify: () => Promise<any>;
  onRunIndex: (forceRebuild: boolean) => Promise<any>;
  onRunRetrieve: (query: string, topK: number) => Promise<any>;
  onRunVerify: (claim: string) => Promise<any>;
  onRunSeed: (seedText: string, seedCategory?: string) => Promise<any>;
  onRunRectify: (originalStatement: string) => Promise<any>;
  onRunRefine: (originalResult: string, instruction: string) => Promise<any>;
}

export const DocumentWorkspace: React.FC<DocumentWorkspaceProps> = ({
  document,
  activeOperation,
  onSelectOperation,
  isLoading,
  operationResults,
  onRunParse,
  onRunExtract,
  onRunClassify,
  onRunIndex,
  onRunRetrieve,
  onRunVerify,
  onRunSeed,
  onRunRectify,
  onRunRefine,
}) => {
  if (!document) {
    return (
      <div className="flex-1 bg-[#F7F6F2] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-xl border border-[#E7E5DF] bg-white flex items-center justify-center mb-4 shadow-2xs">
          <FileText className="w-8 h-8 text-[#999992]" />
        </div>
        <h3 className="text-sm font-semibold text-[#171717] font-mono">No Document Selected</h3>
        <p className="text-xs text-[#6B6B66] max-w-sm mt-1">
          Select a document from the library sidebar on the left or upload a new PDF, DOCX, or TXT file to inspect LlamaIndex processing.
        </p>
      </div>
    );
  }

  const operationsList: { id: OperationType; label: string; icon: any }[] = [
    { id: "parse", label: "Parse", icon: Layers },
    { id: "extract", label: "Extract", icon: Sparkles },
    { id: "classify", label: "Classify", icon: Tag },
    { id: "index", label: "Index", icon: Database },
    { id: "retrieve", label: "Retrieve", icon: Search },
    { id: "verify", label: "Verify", icon: CheckSquare },
    { id: "seed", label: "Seed", icon: Sprout },
    { id: "rectify", label: "Rectify", icon: Wrench },
    { id: "refine", label: "Refine", icon: Sliders },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <main className="flex-1 bg-[#F7F6F2] flex flex-col min-w-0 overflow-y-auto">
      {/* Workspace Document Header */}
      <div className="p-5 border-b border-[#E7E5DF] bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#FAF9F6] border border-[#E7E5DF]">
              <FileText className="w-5 h-5 text-[#D9531E]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#171717] tracking-tight">
                {document.filename}
              </h2>
              <div className="flex items-center gap-3 text-xs font-mono text-[#6B6B66] mt-0.5">
                <span>{document.file_type.toUpperCase()}</span>
                <span>•</span>
                <span>{formatFileSize(document.file_size)}</span>
                <span>•</span>
                <span className="text-[#2A7E43] font-medium">Status: {document.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Tab Navigation Bar */}
        <div className="mt-5 border-t border-[#F0EEE9] pt-3 flex items-center gap-1 overflow-x-auto">
          {operationsList.map((op) => {
            const Icon = op.icon;
            const isActive = activeOperation === op.id;
            return (
              <button
                key={op.id}
                onClick={() => onSelectOperation(op.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#171717] text-white font-medium shadow-xs"
                    : "text-[#6B6B66] hover:bg-[#F2EFE9] hover:text-[#171717]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#D9531E]" : "text-[#999992]"}`} />
                <span>{op.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contextual Processing State Animation overlay */}
      {isLoading && (
        <div className="p-4 bg-[#FAF9F6] border-b border-[#E7E5DF] flex items-center justify-between text-xs font-mono text-[#171717] animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-[#D9531E] animate-spin" />
            <span>Executing LlamaIndex {activeOperation.toUpperCase()} pipeline...</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#6B6B66]">
            <span>✓ Loading document</span>
            <ArrowRight className="w-3 h-3" />
            <span>Processing nodes</span>
            <ArrowRight className="w-3 h-3" />
            <span className="text-[#D9531E]">Synthesizing output</span>
          </div>
        </div>
      )}

      {/* Operation View Content */}
      <div className="p-6">
        {activeOperation === "parse" && (
          <ParseView
            document={document}
            onRunParse={onRunParse}
            isLoading={isLoading}
            result={operationResults.parse}
          />
        )}
        {activeOperation === "extract" && (
          <ExtractView
            document={document}
            onRunExtract={onRunExtract}
            isLoading={isLoading}
            result={operationResults.extract}
          />
        )}
        {activeOperation === "classify" && (
          <ClassifyView
            document={document}
            onRunClassify={onRunClassify}
            isLoading={isLoading}
            result={operationResults.classify}
          />
        )}
        {activeOperation === "index" && (
          <IndexView
            document={document}
            onRunIndex={onRunIndex}
            isLoading={isLoading}
            result={operationResults.index}
          />
        )}
        {activeOperation === "retrieve" && (
          <RetrieveView
            document={document}
            onRunRetrieve={onRunRetrieve}
            isLoading={isLoading}
            result={operationResults.retrieve}
          />
        )}
        {activeOperation === "verify" && (
          <VerifyView
            document={document}
            onRunVerify={onRunVerify}
            isLoading={isLoading}
            result={operationResults.verify}
          />
        )}
        {activeOperation === "seed" && (
          <SeedView
            document={document}
            onRunSeed={onRunSeed}
            isLoading={isLoading}
            result={operationResults.seed}
          />
        )}
        {activeOperation === "rectify" && (
          <RectifyView
            document={document}
            onRunRectify={onRunRectify}
            isLoading={isLoading}
            result={operationResults.rectify}
          />
        )}
        {activeOperation === "refine" && (
          <RefineView
            document={document}
            onRunRefine={onRunRefine}
            isLoading={isLoading}
            result={operationResults.refine}
          />
        )}
      </div>
    </main>
  );
};
