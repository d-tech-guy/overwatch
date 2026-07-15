"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { PROCESSING_STATUS } from "@/lib/constants";
import type { ProcessingStatus } from "@/types/incident";

interface InvestigationTerminalProps {
  id: string;
  publicToken: string;
  onFinish: () => void;
}

interface StreamPayload {
  status: ProcessingStatus;
  progress: number;
}

const STATUS_MESSAGES: Partial<Record<ProcessingStatus, string>> = {
  [PROCESSING_STATUS.fetchingMetadata]: "Fetching content metadata…",
  [PROCESSING_STATUS.metadataComplete]: "✓ Metadata retrieved",
  [PROCESSING_STATUS.analyzing]: "Running AI analysis…",
  [PROCESSING_STATUS.reportGenerating]: "Generating investigation report…",
  [PROCESSING_STATUS.completed]: "✓ Investigation complete",
  [PROCESSING_STATUS.failedMetadata]: "✕ Metadata retrieval failed",
  [PROCESSING_STATUS.failedAi]: "✕ AI analysis failed",
};

const TERMINAL_STATUSES: ProcessingStatus[] = [
  PROCESSING_STATUS.completed,
  PROCESSING_STATUS.failedMetadata,
  PROCESSING_STATUS.failedAi,
];

/**
 * InvestigationTerminal
 *
 * Displays real-time progress for an in-flight investigation.
 * Consumes the /api/investigations/[id]/stream SSE endpoint,
 * passing the publicToken as a query parameter for server-side auth.
 *
 * Never subscribes to Supabase Realtime directly — all data access
 * is gated server-side by the token validation in the route handler.
 */
export function InvestigationTerminal({
  id,
  publicToken,
  onFinish,
}: InvestigationTerminalProps) {
  const [status, setStatus] = useState<ProcessingStatus>(PROCESSING_STATUS.queued);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>(["Investigation queued"]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `/api/investigations/${id}/stream?token=${encodeURIComponent(publicToken)}`;
    const source = new EventSource(url);

    source.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as StreamPayload;
        const { status: newStatus, progress: newProgress } = payload;

        setStatus((prev) => {
          if (newStatus !== prev) {
            const message = STATUS_MESSAGES[newStatus];
            if (message) {
              setLog((lines) => [...lines, message]);
            }
          }
          return newStatus;
        });

        setProgress(newProgress);

        if (TERMINAL_STATUSES.includes(newStatus)) {
          source.close();
        }
      } catch {
        // Ignore malformed events.
      }
    };

    source.onerror = () => {
      source.close();
      setLog((lines) => [...lines, "Connection lost. Please check your results."]);
    };

    return () => {
      source.close();
    };
  }, [id, publicToken]);

  // Auto-scroll the log to the bottom on new entries.
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  const isTerminal = TERMINAL_STATUSES.includes(status);
  const isComplete = status === PROCESSING_STATUS.completed;

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[600px] bg-black border border-zinc-800 rounded-none [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm tracking-widest uppercase text-zinc-400">
            Investigation Terminal
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 font-mono text-sm mt-2">
          {/* ID + status */}
          <div className="flex justify-between items-center border border-zinc-800 px-4 py-2">
            <span className="text-zinc-500 text-xs">REF</span>
            <span className="text-zinc-300 text-xs truncate max-w-[200px]">{id}</span>
            <span className="text-white text-xs uppercase tracking-wider">
              {status.replaceAll("_", " ")}
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <Progress
              value={progress}
              className="h-1.5 rounded-none bg-zinc-900 [&>div]:bg-white [&>div]:rounded-none"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>PROGRESS</span>
              <span>{progress}%</span>
            </div>
          </div>

          {/* Log output */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-none">
            <CardContent className="p-4 h-44 overflow-y-auto space-y-1.5">
              {log.map((line, i) => (
                <p key={i} className="text-zinc-400 text-xs leading-relaxed">
                  <span className="text-zinc-700 mr-2 select-none">›</span>
                  {line}
                </p>
              ))}
              <div ref={logEndRef} />
            </CardContent>
          </Card>

          {/* Action button — only shown in terminal state */}
          {isTerminal && (
            <div className="flex justify-end pt-2">
              <button
                onClick={onFinish}
                className="font-mono text-xs uppercase tracking-widest px-6 py-2.5 bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                {isComplete ? "View Report" : "Dismiss"}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
