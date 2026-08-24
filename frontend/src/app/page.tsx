"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DocumentLibrary } from "@/components/DocumentLibrary";
import { DocumentWorkspace, OperationType } from "@/components/DocumentWorkspace";
import { ExecutionInspector } from "@/components/ExecutionInspector";
import { UploadModal } from "@/components/UploadModal";
import { SettingsModal } from "@/components/SettingsModal";
import { api, DocumentRecord, ProcessingRun, SettingsStatus } from "@/lib/api";

export default function Home() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [activeOperation, setActiveOperation] = useState<OperationType>("parse");

  const [runs, setRuns] = useState<ProcessingRun[]>([]);
  const [activeRun, setActiveRun] = useState<ProcessingRun | null>(null);

  const [settings, setSettings] = useState<SettingsStatus | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [operationResults, setOperationResults] = useState<Record<string, any>>({});

  // Fetch initial documents and settings
  const fetchDocuments = async () => {
    try {
      const docs = await api.listDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDocId) {
        setSelectedDocId(docs[0].id);
      }
      setIsBackendConnected(true);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setIsBackendConnected(false);
    }
  };

  const fetchRuns = async (docId?: string) => {
    try {
      const r = await api.listRuns(docId || undefined);
      setRuns(r);
      if (r.length > 0) setActiveRun(r[0]);
    } catch (err) {
      console.error("Failed to fetch runs:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const s = await api.getSettings();
      setSettings(s);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchRuns();
    fetchSettings();
  }, []);

  useEffect(() => {
    if (selectedDocId) {
      fetchRuns(selectedDocId);
    }
  }, [selectedDocId]);

  const selectedDocument = documents.find((d) => d.id === selectedDocId) || null;

  // Handlers
  const handleUpload = async (file: File) => {
    const newDoc = await api.uploadDocument(file);
    await fetchDocuments();
    setSelectedDocId(newDoc.id);
  };

  const handleDelete = async (docId: string) => {
    await api.deleteDocument(docId);
    if (selectedDocId === docId) {
      setSelectedDocId(null);
    }
    await fetchDocuments();
  };

  // Operation Execution Helpers
  const executeOperation = async (opName: OperationType, apiCall: () => Promise<any>) => {
    setIsLoading(true);
    try {
      const res = await apiCall();
      setOperationResults((prev) => ({ ...prev, [opName]: res }));
      await fetchRuns(selectedDocId || undefined);
      await fetchDocuments();
    } catch (err: any) {
      console.error(`Operation ${opName} failed:`, err);
      alert(`Operation ${opName} failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunParse = (chunkSize: number, chunkOverlap: number) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("parse", () => api.parseDocument(selectedDocId, chunkSize, chunkOverlap));
  };

  const handleRunExtract = (fields?: string[]) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("extract", () => api.extractDocument(selectedDocId, fields));
  };

  const handleRunClassify = () => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("classify", () => api.classifyDocument(selectedDocId));
  };

  const handleRunIndex = (forceRebuild: boolean) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("index", () => api.indexDocument(selectedDocId, forceRebuild));
  };

  const handleRunRetrieve = (query: string, topK: number) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("retrieve", () => api.retrieveQuery(selectedDocId, query, topK));
  };

  const handleRunVerify = (claim: string) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("verify", () => api.verifyClaim(selectedDocId, claim));
  };

  const handleRunSeed = (seedText: string, seedCategory?: string) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("seed", () => api.seedNodes(selectedDocId, seedText, seedCategory));
  };

  const handleRunRectify = (originalStatement: string) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("rectify", () => api.rectifyStatement(selectedDocId, originalStatement));
  };

  const handleRunRefine = (originalResult: string, instruction: string) => {
    if (!selectedDocId) return Promise.reject();
    return executeOperation("refine", () => api.refineResponse(selectedDocId, originalResult, instruction));
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F6F2] overflow-hidden">
      {/* Top Workbench Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendConnected={isBackendConnected}
        settings={settings}
      />

      {/* Main 3-Column Desktop Workspace */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left: Document Library */}
        <DocumentLibrary
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDoc={setSelectedDocId}
          onOpenUpload={() => setIsUploadOpen(true)}
          onDeleteDoc={handleDelete}
        />

        {/* Center: Document Workspace */}
        <DocumentWorkspace
          document={selectedDocument}
          activeOperation={activeOperation}
          onSelectOperation={setActiveOperation}
          isLoading={isLoading}
          operationResults={operationResults}
          onRunParse={handleRunParse}
          onRunExtract={handleRunExtract}
          onRunClassify={handleRunClassify}
          onRunIndex={handleRunIndex}
          onRunRetrieve={handleRunRetrieve}
          onRunVerify={handleRunVerify}
          onRunSeed={handleRunSeed}
          onRunRectify={handleRunRectify}
          onRunRefine={handleRunRefine}
        />

        {/* Right: Execution Inspector */}
        <ExecutionInspector
          runs={runs}
          activeRun={activeRun}
          isOpen={isInspectorOpen}
          onToggleOpen={() => setIsInspectorOpen(!isInspectorOpen)}
        />
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onRefreshSettings={fetchSettings}
      />
    </div>
  );
}
