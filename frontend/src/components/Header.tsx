"use client";

import React from "react";
import { Settings, CheckCircle2, AlertCircle, Cloud, CloudOff, User } from "lucide-react";
import { SettingsStatus } from "@/lib/api";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

interface HeaderProps {
  onOpenSettings: () => void;
  isBackendConnected: boolean;
  settings: SettingsStatus | null;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, isBackendConnected, settings }) => {
  const hasLlamaCloud = Boolean(settings?.has_llamacloud_key);
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="h-14 border-b border-[#E7E5DF] bg-white px-5 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-[#D9531E] flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs">
          LC
        </div>
        <div>
          <h1 className="text-sm font-semibold text-[#171717] tracking-tight flex items-center gap-2">
            DocLab
            <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded bg-[#F2EFE9] text-[#6B6B66]">
              LlamaCloud Edition
            </span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* LlamaCloud Connection Status Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B6B66] font-mono border-r border-[#E7E5DF] pr-4">
          {hasLlamaCloud ? (
            <div className="flex items-center gap-1.5 text-[#2A7E43]">
              <Cloud className="w-3.5 h-3.5 fill-current" />
              <span className="font-semibold">LlamaCloud ● Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#B46C00]">
              <CloudOff className="w-3.5 h-3.5" />
              <span>LlamaCloud ● Configuration Required</span>
            </div>
          )}
        </div>

        {/* Backend status indicator */}
        <div className="flex items-center gap-1.5 text-xs text-[#6B6B66] font-mono border-r border-[#E7E5DF] pr-4">
          {isBackendConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2A7E43]" />
              <span>FastAPI Connected</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-[#C53030]" />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Clerk Auth Section */}
        <div className="flex items-center gap-2">
          {isLoaded && isSignedIn ? (
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-7 h-7" } }} />
          ) : (
            <SignInButton mode="modal">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] text-white text-xs font-medium hover:bg-[#2A2A2A] transition-colors cursor-pointer shadow-xs">
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </SignInButton>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E7E5DF] bg-white text-xs font-medium text-[#171717] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-[#6B6B66]" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
