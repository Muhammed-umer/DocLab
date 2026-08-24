"use client";

import React, { useState, useEffect } from "react";
import { SettingsStatus, api } from "@/lib/api";
import { X, Save, Key, Cpu, Database, Check, Loader2, Cloud } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsStatus | null;
  onRefreshSettings: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onRefreshSettings,
}) => {
  const [llamaCloudKey, setLlamaCloudKey] = useState("");
  const [llmProvider, setLlmProvider] = useState("openai");
  const [llmKey, setLlmKey] = useState("");
  const [llmModel, setLlmModel] = useState("gpt-4o-mini");

  const [embedProvider, setEmbedProvider] = useState("openai");
  const [embedKey, setEmbedKey] = useState("");
  const [embedModel, setEmbedModel] = useState("text-embedding-3-small");

  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseKey, setSupabaseKey] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setLlmProvider(settings.llm_provider || "openai");
      setLlmModel(settings.llm_model || "gpt-4o-mini");
      setEmbedProvider(settings.embedding_provider || "openai");
      setEmbedModel(settings.embedding_model || "text-embedding-3-small");
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await api.updateSettings({
        llama_cloud_api_key: llamaCloudKey || undefined,
        llm_provider: llmProvider,
        llm_api_key: llmKey || undefined,
        llm_model: llmModel,
        embedding_provider: embedProvider,
        embedding_api_key: embedKey || undefined,
        embedding_model: embedModel,
        supabase_url: supabaseUrl || undefined,
        supabase_key: supabaseKey || undefined,
      });
      setSaveSuccess(true);
      onRefreshSettings();
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#171717]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-[#E7E5DF] shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E7E5DF] pb-3 mb-5">
          <div>
            <h3 className="text-sm font-semibold text-[#171717] font-mono">
              LlamaCloud & Services Configuration
            </h3>
            <p className="text-xs text-[#6B6B66]">Configure LlamaCloud API Key, LLM, & Supabase credentials</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B6B66] hover:text-[#171717] rounded hover:bg-[#F2EFE9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6 text-xs">
          {/* LlamaCloud Section */}
          <div className="space-y-3 p-3.5 rounded border border-[#D9531E]/30 bg-[#FDF3EE]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717] font-mono">
                <Cloud className="w-4 h-4 text-[#D9531E]" />
                <span>LlamaCloud API Key (Required)</span>
              </div>
              {settings?.has_llamacloud_key && (
                <span className="text-[#2A7E43] font-mono text-[10px]">✓ Configured</span>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6B6B66] mb-1">
                LlamaCloud API Key (`llx-...`)
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#999992]" />
                <input
                  type="password"
                  placeholder={settings?.has_llamacloud_key ? "••••••••••••••••" : "llx-..."}
                  value={llamaCloudKey}
                  onChange={(e) => setLlamaCloudKey(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
                />
              </div>
              <p className="text-[10px] text-[#6B6B66] mt-1">
                Required for LlamaParse, LlamaExtract, LlamaCloudIndex, and LlamaCloudRetriever.
              </p>
            </div>
          </div>

          {/* LLM Section */}
          <div className="space-y-3 p-3.5 rounded border border-[#E7E5DF] bg-[#FAF9F6]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#171717] font-mono">
              <Cpu className="w-4 h-4 text-[#D9531E]" />
              <span>LLM Provider & Model</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#6B6B66] mb-1">Provider</label>
                <select
                  value={llmProvider}
                  onChange={(e) => setLlmProvider(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E7E5DF] rounded text-xs focus:outline-none focus:border-[#D9531E]"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#6B6B66] mb-1">Model Name</label>
                <input
                  type="text"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                  placeholder="gpt-4o-mini"
                  className="w-full p-2 bg-white border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6B6B66] mb-1 flex items-center justify-between">
                <span>LLM API Key</span>
                {settings?.has_llm_key && (
                  <span className="text-[#2A7E43] font-mono text-[10px]">✓ Configured</span>
                )}
              </label>
              <div className="relative">
                <Key className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#999992]" />
                <input
                  type="password"
                  placeholder={settings?.has_llm_key ? "••••••••••••••••" : "Paste LLM Key..."}
                  value={llmKey}
                  onChange={(e) => setLlmKey(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
                />
              </div>
            </div>
          </div>

          {/* Supabase Section */}
          <div className="space-y-3 p-3.5 rounded border border-[#E7E5DF] bg-[#FAF9F6]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#171717] font-mono">
                <Database className="w-4 h-4 text-[#3ECF8E]" />
                <span>Supabase Credentials</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E7E5DF] text-[#6B6B66]">
                {settings?.has_supabase ? "Active" : "SQLite Fallback Active"}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6B6B66] mb-1">Supabase URL</label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full p-2 bg-white border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6B6B66] mb-1">
                Service Role Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGci..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full p-2 bg-white border border-[#E7E5DF] rounded text-xs font-mono focus:outline-none focus:border-[#D9531E]"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#E7E5DF]">
          {saveSuccess ? (
            <div className="flex items-center gap-1.5 text-xs text-[#2A7E43] font-medium font-mono">
              <Check className="w-4 h-4" />
              <span>Settings updated successfully</span>
            </div>
          ) : (
            <span className="text-[11px] text-[#6B6B66]">Saved to root .env</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#E7E5DF] text-xs font-medium text-[#171717] hover:bg-[#F2EFE9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded bg-[#171717] text-white text-xs font-medium hover:bg-[#2A2A2A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
