"use client";

import { useInvestigationContext } from "@/context/investigation-context";
import { Maximize2, X, Activity } from "lucide-react";
import { PROCESSING_STATUS } from "@/lib/constants";

export function BackgroundDock() {
  const { activeInvestigationId, isMinimized, restoreModal, closeModal, status, progress } = useInvestigationContext();

  if (!isMinimized || !activeInvestigationId) return null;

  const isComplete = status === PROCESSING_STATUS.completed;
  const isFailed = status === PROCESSING_STATUS.failed;

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-black border border-zinc-800 shadow-2xl p-4 w-80 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-3">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          ) : isFailed ? (
            <div className="w-2 h-2 bg-red-500 rounded-full" />
          ) : (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
            {isComplete ? "Analysis Complete" : isFailed ? "Analysis Failed" : "Active Process"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={restoreModal}
            className="text-zinc-500 hover:text-white transition-colors"
            title="Restore Window"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          {(isComplete || isFailed) && (
            <button 
              onClick={closeModal}
              className="text-zinc-500 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 cursor-pointer" onClick={restoreModal}>
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 block mb-1">
            Session ID
          </span>
          <span className="font-mono text-sm text-white">
            {activeInvestigationId.split("-")[0]}
          </span>
        </div>

        {!isComplete && !isFailed && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                {status?.replace(/_/g, " ")}
              </span>
              <span className="font-mono text-xs text-zinc-400">{progress}%</span>
            </div>
            <div className="w-full bg-zinc-900 h-1">
              <div 
                className="bg-white h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
