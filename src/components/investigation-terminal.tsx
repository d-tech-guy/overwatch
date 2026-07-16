"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PROCESSING_STATUS } from "@/lib/constants";

interface InvestigationTerminalProps {
  id: string;
  publicToken: string;
  onFinish: () => void;
}

interface LogEntry {
  id: string;
  event: string;
  description: string;
  createdAt: string;
}

interface StreamPayload {
  status: string;
  progress: number;
  logs: LogEntry[];
}

const TERMINAL_STATUSES = new Set([PROCESSING_STATUS.completed, PROCESSING_STATUS.failed]);

function useElapsedTime(running: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const tick = setInterval(() => setElapsed(Date.now() - start), 1000);
    return () => clearInterval(tick);
  }, [running]);
  const s = Math.floor(elapsed / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").toUpperCase();
}

export function InvestigationTerminal({
  id,
  publicToken,
  onFinish,
}: InvestigationTerminalProps) {
  const [status, setStatus] = useState(PROCESSING_STATUS.queued as string);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  const isTerminal = TERMINAL_STATUSES.has(status as "completed" | "failed");
  const isComplete = status === PROCESSING_STATUS.completed;
  const elapsed = useElapsedTime(!isTerminal);

  useEffect(() => {
    const url = `/api/investigations/${id}/stream?token=${encodeURIComponent(publicToken)}`;
    const source = new EventSource(url);

    source.onopen = () => setConnected(true);

    source.onmessage = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as StreamPayload;
        setStatus(payload.status);
        setProgress(payload.progress);

        if (payload.logs.length > 0) {
          setLogs((prev) => {
            const existingIds = new Set(prev.map((l) => l.id));
            const incoming = payload.logs.filter((l) => !existingIds.has(l.id));
            return [...prev, ...incoming];
          });
        }

        if (TERMINAL_STATUSES.has(payload.status as "completed" | "failed")) {
          source.close();
          setConnected(false);
        }
      } catch {
        // Ignore malformed events
      }
    };

    source.onerror = () => {
      setConnected(false);
      source.close();
    };

    return () => source.close();
  }, [id, publicToken]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[680px] bg-black border border-zinc-800 rounded-none [&>button]:hidden p-0">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-zinc-800">
          <DialogTitle className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 flex items-center gap-3">
            <span className="text-white">OVERWATCH</span>
            <span className="text-zinc-700">|</span>
            <span>Investigation Terminal</span>
            <span className={`ml-auto h-2 w-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-4 space-y-4 font-mono">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-2 text-xs border border-zinc-800 p-3">
            <div>
              <span className="text-zinc-600">INVESTIGATION ID</span>
              <p className="text-zinc-300 truncate mt-0.5">{id}</p>
            </div>
            <div>
              <span className="text-zinc-600">ELAPSED</span>
              <p className="text-white mt-0.5">{elapsed}</p>
            </div>
            <div className="mt-2">
              <span className="text-zinc-600">CURRENT STAGE</span>
              <p className="text-white mt-0.5">{formatStatus(status)}</p>
            </div>
            <div className="mt-2">
              <span className="text-zinc-600">CONNECTION</span>
              <p className={`mt-0.5 ${connected ? "text-green-400" : "text-zinc-500"}`}>
                {connected ? "ACTIVE" : isTerminal ? "CLOSED" : "RECONNECTING..."}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <Progress
              value={progress}
              className="h-1 rounded-none bg-zinc-900 [&>div]:bg-white [&>div]:rounded-none transition-all duration-700"
            />
            <div className="flex justify-between text-xs text-zinc-600">
              <span>PROGRESS</span>
              <span className="text-zinc-400">{progress}%</span>
            </div>
          </div>

          {/* Log output */}
          <div className="bg-zinc-950 border border-zinc-900 h-52 overflow-y-auto p-3 space-y-1">
            {logs.length === 0 && (
              <p className="text-zinc-700 text-xs">Waiting for investigation to begin...</p>
            )}
            {logs.map((entry) => (
              <div key={entry.id} className="flex items-start gap-2 text-xs leading-relaxed">
                <span className="text-zinc-700 select-none shrink-0 mt-0.5">›</span>
                <span className="text-zinc-600 shrink-0">
                  [{new Date(entry.createdAt).toLocaleTimeString("en-GB", { hour12: false })}]
                </span>
                <span className={entry.description.startsWith("✓")
                  ? "text-green-400"
                  : entry.description.startsWith("✕")
                  ? "text-red-400"
                  : entry.description.startsWith("⚠")
                  ? "text-yellow-400"
                  : "text-zinc-300"
                }>
                  {entry.description}
                </span>
              </div>
            ))}
            {/* Blinking cursor */}
            {!isTerminal && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-700 select-none">›</span>
                <span className="inline-block w-2 h-3 bg-white animate-pulse" />
              </div>
            )}
            <div ref={logEndRef} />
          </div>

          {/* Action button */}
          {isTerminal && (
            <div className="flex justify-between items-center pt-1 border-t border-zinc-800">
              <span className={`text-xs font-mono ${isComplete ? "text-green-400" : "text-red-400"}`}>
                {isComplete ? "✓ INVESTIGATION COMPLETE" : "✕ INVESTIGATION FAILED"}
              </span>
              <button
                onClick={onFinish}
                className="font-mono text-xs uppercase font-semibold tracking-widest px-6 py-2 bg-white text-black hover:bg-zinc-200 transition-colors"
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
