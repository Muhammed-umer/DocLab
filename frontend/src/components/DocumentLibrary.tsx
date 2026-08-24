"use client";

import React, { useState } from "react";
import { DocumentRecord } from "@/lib/api";
import { FileText, Upload, Search, Trash2, FileCode, CheckCircle, Clock } from "lucide-react";

interface DocumentLibraryProps {
  documents: DocumentRecord[];
  selectedDocId: string | null;
  onSelectDoc: (id: string) => void;
  onOpenUpload: () => void;
  onDeleteDoc: (id: string) => void;
}

export const DocumentLibrary: React.FC<DocumentLibraryProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onOpenUpload,
  onDeleteDoc,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (fileType: string, filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="w-4 h-4 text-[#D9531E]" />;
    if (ext === "docx") return <FileFile className="w-4 h-4 text-[#2B579A]" />;
    return <FileCode className="w-4 h-4 text-[#6B6B66]" />;
  };

  return (
    <aside className="w-72 border-r border-[#E7E5DF] bg-[#FAF9F6] flex flex-col h-full shrink-0">
      {/* Top Header */}
      <div className="p-4 border-b border-[#E7E5DF]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-semibold text-[#171717] uppercase tracking-wider font-mono">
              Document Library
            </h2>
            <p className="text-[11px] text-[#6B6B66]">Central document context</p>
          </div>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171717] text-white text-xs font-medium hover:bg-[#2A2A2A] transition-colors cursor-pointer shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#999992]" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E7E5DF] rounded text-xs text-[#171717] placeholder-[#999992] focus:outline-none focus:border-[#D9531E]"
          />
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredDocs.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#6B6B66]">
            {searchQuery ? "No documents match search" : "No documents uploaded yet"}
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDocId;
            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`group relative p-2.5 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#D9531E] shadow-xs"
                    : "bg-transparent border-transparent hover:bg-[#F2EFE9] hover:border-[#E7E5DF]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div className="mt-0.5 shrink-0">{getFileIcon(doc.file_type, doc.filename)}</div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          isSelected ? "text-[#171717]" : "text-[#171717]"
                        }`}
                      >
                        {doc.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#6B6B66]">
                        <span>{doc.filename.split(".").pop()?.toUpperCase()}</span>
                        <span>•</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDoc(doc.id);
                    }}
                    title="Delete document"
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#999992] hover:text-[#C53030] transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Status indicator */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono border-t border-[#F0EEE9] pt-1.5">
                  <span className="text-[#6B6B66] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#999992]" />
                    {new Date(doc.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-medium ${
                      doc.status === "indexed"
                        ? "bg-[#F0F9F2] text-[#2A7E43]"
                        : doc.status === "parsed"
                        ? "bg-[#FEF7EC] text-[#B46C00]"
                        : "bg-[#F2EFE9] text-[#6B6B66]"
                    }`}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer stats */}
      <div className="p-3 border-t border-[#E7E5DF] bg-white text-[11px] font-mono text-[#6B6B66] flex items-center justify-between">
        <span>{documents.length} document(s)</span>
        <span>Supabase / SQLite</span>
      </div>
    </aside>
  );
};

function FileFile(props: any) {
  return <FileText {...props} />;
}
