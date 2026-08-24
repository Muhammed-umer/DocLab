"use client";

import React, { useState, useRef } from "react";
import { X, UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "docx", "txt"].includes(ext || "")) {
        setErrorMsg("Invalid file type. Please upload a PDF, DOCX, or TXT file.");
        setSelectedFile(null);
        return;
      }
      setErrorMsg(null);
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!["pdf", "docx", "txt"].includes(ext || "")) {
        setErrorMsg("Invalid file type. Please upload a PDF, DOCX, or TXT file.");
        setSelectedFile(null);
        return;
      }
      setErrorMsg(null);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMsg(null);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#E7E5DF] shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3 mb-4">
          <h3 className="text-sm font-semibold text-[#171717] font-mono">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#6B6B66] hover:text-[#171717] rounded hover:bg-[#F2EFE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-[#FFF5F5] border border-[#FEB2B2] text-xs text-[#C53030] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E7E5DF] hover:border-[#D9531E] rounded-lg p-6 text-center cursor-pointer transition-colors bg-[#FAF9F6] hover:bg-[#F2EFE9]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
          <UploadCloud className="w-8 h-8 text-[#999992] mx-auto mb-2" />
          <p className="text-xs font-medium text-[#171717]">Click to upload or drag & drop</p>
          <p className="text-[11px] text-[#6B6B66] mt-1 font-mono">Supports PDF, DOCX, TXT</p>
        </div>

        {selectedFile && (
          <div className="mt-4 p-3 rounded border border-[#E7E5DF] bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-[#D9531E] shrink-0" />
              <span className="truncate font-medium text-[#171717]">{selectedFile.name}</span>
            </div>
            <span className="text-[11px] font-mono text-[#6B6B66]">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-2 pt-3 border-t border-[#E7E5DF]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded border border-[#E7E5DF] text-xs font-medium text-[#171717] hover:bg-[#F2EFE9] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className="px-4 py-1.5 rounded bg-[#D9531E] text-white text-xs font-medium hover:bg-[#C44616] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isUploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Upload Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
