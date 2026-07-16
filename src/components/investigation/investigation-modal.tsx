"use client";

import { useInvestigationContext } from "@/context/investigation-context";
import { InvestigationTerminalRealtime } from "@/components/investigation-terminal";
import { X, Minus, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PROCESSING_STATUS } from "@/lib/constants";

export function InvestigationModal() {
  const { activeInvestigationId, publicToken, isModalOpen, minimizeModal, closeModal, status } = useInvestigationContext();

  if (!isModalOpen || !activeInvestigationId) return null;

  const isComplete = status === PROCESSING_STATUS.completed;
  const isFailed = status === PROCESSING_STATUS.failed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl h-[85vh] bg-black border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="h-12 border-b border-zinc-900 flex items-center justify-between px-4 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Session // {activeInvestigationId.split("-")[0]}
            </span>
            {isComplete && (
              <span className="bg-green-950/30 text-green-500 border border-green-900/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                Analysis Complete
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isComplete && !isFailed && (
              <button 
                onClick={minimizeModal}
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
                title="Run in Background"
              >
                <Minus className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={closeModal}
              className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 relative flex flex-col bg-zinc-950">
          {isComplete ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-green-950/30 border border-green-900/50 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-white">Investigation Complete</h2>
              <p className="font-mono text-sm text-zinc-400 max-w-md leading-relaxed">
                The intelligence pipeline has successfully analyzed the subject and generated a comprehensive report.
              </p>
              
              <div className="flex gap-4 mt-4">
                <Link 
                  href={`/report/${activeInvestigationId}`}
                  className="bg-white text-black hover:bg-zinc-200 px-6 py-3 font-mono text-sm uppercase tracking-widest font-bold transition-colors"
                >
                  View Full Report
                </Link>
                <button 
                  onClick={closeModal}
                  className="bg-black text-white hover:text-zinc-300 border border-zinc-800 px-6 py-3 font-mono text-sm uppercase tracking-widest transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <InvestigationTerminalRealtime 
              investigationId={activeInvestigationId}
              publicToken={publicToken!}
              initialEvents={[]}
              initialStatus="queued"
              initialProgress={0}
            />
          )}
        </div>
      </div>
    </div>
  );
}
