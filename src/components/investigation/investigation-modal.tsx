"use client";

import { useEffect, useState } from "react";
import { useInvestigationContext } from "@/context/investigation-context";
import { InvestigationTerminalRealtime } from "@/components/investigation-terminal";
import { X, Minus } from "lucide-react";
import Link from "next/link";
import { PROCESSING_STATUS } from "@/lib/constants";
import { getInvestigationState, retryInvestigation } from "@/actions/incidents";
import type { TerminalEvent } from "@/components/investigation-terminal";

export function InvestigationModal() {
  const {
    activeInvestigationId,
    publicToken,
    isModalOpen,
    minimizeModal,
    closeModal,
    status,
    updateProgress,
  } = useInvestigationContext();

  const [loading, setLoading] = useState(true);
  const [initialEvents, setInitialEvents] = useState<TerminalEvent[]>([]);
  const [initialStatus, setInitialStatus] = useState("queued");
  const [initialProgress, setInitialProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!isModalOpen || !activeInvestigationId) return;

    let isMounted = true;
    setLoading(true);

    getInvestigationState(activeInvestigationId).then((res) => {
      if (!isMounted) return;
      if (res && !("error" in res)) {
        setInitialEvents(
          res.events.map((e) => ({
            id: e.id,
            event: e.event,
            description: e.description,
            createdAt: e.createdAt,
            progress: e.progress,
            stage: e.stage ?? undefined,
            severity: e.severity ?? undefined,
            type: e.type ?? undefined,
            shortMessage: e.shortMessage ?? undefined,
            detailedMessage: e.detailedMessage ?? undefined,
            duration: e.duration ?? undefined,
            correlationId: e.correlationId ?? undefined,
            metadataJson: e.metadataJson,
          }))
        );
        setInitialStatus(res.status);
        setInitialProgress(res.progress);
        updateProgress(res.status, res.progress);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [activeInvestigationId, isModalOpen]);

  if (!isModalOpen || !activeInvestigationId) return null;

  const isComplete = status === PROCESSING_STATUS.completed;
  const isFailed = status === PROCESSING_STATUS.failed;

  const handleRetry = async () => {
    setIsRetrying(true);
    const res = await retryInvestigation(activeInvestigationId);
    if (res && !("error" in res)) {
      setInitialEvents([]);
      setInitialStatus("queued");
      setInitialProgress(0);
      updateProgress("queued", 0);
    }
    setIsRetrying(false);
  };

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
            {isFailed && (
              <span className="bg-red-950/30 text-red-500 border border-red-900/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
                Analysis Failed
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
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-zinc-500 uppercase tracking-widest">
              Initializing live operational terminal...
            </div>
          ) : isComplete ? (
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
                  onClick={closeModal}
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
              initialEvents={initialEvents}
              initialStatus={initialStatus}
              initialProgress={initialProgress}
              onComplete={(termStatus) => updateProgress(termStatus, termStatus === "completed" ? 100 : 0)}
              onRetry={handleRetry}
              isRetrying={isRetrying}
            />
          )}
        </div>
      </div>
    </div>
  );
}
