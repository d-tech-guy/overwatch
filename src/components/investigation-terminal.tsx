"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInvestigationState } from "@/actions/incidents";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TerminalEvent {
  id: string;
  event: string;
  description: string;
  createdAt: string;
  progress?: number | null;
  stage?: string;
  severity?: string;
  type?: string;
  shortMessage?: string;
  detailedMessage?: string;
  duration?: number;
  correlationId?: string;
  metadataJson?: unknown;
}

type Severity = "success" | "error" | "warning" | "info" | "fatal";

function getSeverity(entry: TerminalEvent): Severity {
  if (entry.severity) return entry.severity as Severity;
  const desc = entry.description;
  if (desc.startsWith("✓")) return "success";
  if (desc.startsWith("✕")) return "error";
  if (desc.startsWith("⚠")) return "warning";
  return "info";
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour12: false });
}

const SEVERITY_STYLES: Record<Severity, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  fatal: "text-red-500 font-bold",
  warning: "text-amber-500",
  info: "text-zinc-400",
};

const SEVERITY_PREFIX: Record<Severity, string> = {
  success: "OK  ",
  error: "ERR ",
  fatal: "CRIT",
  warning: "WRN ",
  info: "    ",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface InvestigationTerminalRealtimeProps {
  investigationId: string;
  publicToken: string;
  initialEvents: TerminalEvent[];
  initialStatus: string;
  initialProgress: number;
  onComplete?: (status: "completed" | "failed") => void;
  onRetry?: () => void;
  isRetrying?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InvestigationTerminalRealtime({
  investigationId,
  initialEvents,
  initialStatus,
  initialProgress,
  onComplete,
  onRetry,
  isRetrying = false,
}: InvestigationTerminalRealtimeProps) {
  const [events, setEvents] = useState<TerminalEvent[]>(initialEvents);
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(initialProgress);
  const [connected, setConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const isTerminal = status === "completed" || status === "failed";

  // ── Supabase Realtime subscription ──────────────────────────────────────────
  useEffect(() => {
    if (isTerminal) return;

    const channel = supabase
      .channel(`terminal:${investigationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "investigation_events",
          filter: `investigation_id=eq.${investigationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            event: string;
            description: string;
            created_at: string;
            progress: number | null;
            stage: string | null;
            severity: string | null;
            type: string | null;
            short_message: string | null;
            detailed_message: string | null;
            duration: number | null;
            correlation_id: string | null;
            metadata_json: unknown;
          };
          setEvents((prev) => {
            if (prev.some((e) => e.id === row.id)) return prev;
            return [
              ...prev,
              {
                id: row.id,
                event: row.event,
                description: row.description ?? "",
                createdAt: row.created_at,
                progress: row.progress,
                stage: row.stage ?? undefined,
                severity: row.severity ?? undefined,
                type: row.type ?? undefined,
                shortMessage: row.short_message ?? undefined,
                detailedMessage: row.detailed_message ?? undefined,
                duration: row.duration ?? undefined,
                correlationId: row.correlation_id ?? undefined,
                metadataJson: row.metadata_json,
              },
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "investigations",
          filter: `id=eq.${investigationId}`,
        },
        (payload) => {
          const row = payload.new as {
            processing_status: string;
            progress: number;
          };
          setStatus(row.processing_status);
          setProgress(row.progress);

          if (
            row.processing_status === "completed" ||
            row.processing_status === "failed"
          ) {
            onComplete?.(row.processing_status as "completed" | "failed");
          }
        }
      )
      .subscribe((subStatus) => {
        const isSubscribed = subStatus === "SUBSCRIBED";
        setConnected(isSubscribed);

        if (isSubscribed) {
          // Re-fetch events to catch up on any missed data
          getInvestigationState(investigationId).then((res) => {
            if (res && !("error" in res)) {
              setEvents((prev) => {
                const prevIds = new Set(prev.map((e) => e.id));
                const newEvents = res.events
                  .filter((e) => !prevIds.has(e.id))
                  .map((e) => ({
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
                  }));
                if (newEvents.length === 0) return prev;
                return [...prev, ...newEvents].sort(
                  (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
              });
              setStatus(res.status);
              setProgress(res.progress);
            }
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investigationId, isTerminal]);

  // ── Auto-scroll ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [events, autoScroll]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    setAutoScroll(atBottom);
  }, []);

  // ── Download ─────────────────────────────────────────────────────────────────
  const downloadTxt = () => {
    const lines = events
      .map((e) => {
        const sev = getSeverity(e);
        const durationStr = e.duration ? ` (${e.duration}ms)` : "";
        return `[${formatTime(e.createdAt)}] ${SEVERITY_PREFIX[sev]} [${e.stage || "PIPELINE"}] ${e.description}${durationStr}`;
      })
      .join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overwatch-${investigationId}-terminal.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overwatch-${investigationId}-terminal.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Diagnostics logic ────────────────────────────────────────────────────────
  const isFailedPipeline = status === "failed";
  const fatalEvent = events.find((e) => getSeverity(e) === "fatal" || getSeverity(e) === "error");
  const failedStage = fatalEvent?.stage || "Unknown Stage";
  const failureReason = fatalEvent?.description || "An unexpected error occurred during execution.";

  // Extract completed stages (unique successful stage updates)
  const completedStages = Array.from(
    new Set(
      events
        .filter((e) => e.stage && getSeverity(e) === "success")
        .map((e) => e.stage)
    )
  );

  // Extract successful operations
  const successfulOps = events.filter((e) => getSeverity(e) === "success");

  return (
    <div className="border border-zinc-800 bg-black font-mono text-xs flex-1 flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-zinc-600 tracking-widest uppercase text-[10px]">
            OPERATIONAL TERMINAL
          </span>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-700 text-[10px]">
            {investigationId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Connection status */}
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 ${
                connected ? "bg-white animate-pulse" : isTerminal ? "bg-zinc-700" : "bg-zinc-600"
              }`}
            />
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest">
              {connected ? "LIVE" : isTerminal ? "CLOSED" : "CONNECTING"}
            </span>
          </div>
          {/* Downloads */}
          <button
            onClick={downloadTxt}
            className="text-zinc-700 hover:text-zinc-400 uppercase tracking-widest text-[10px] transition-colors"
          >
            TXT
          </button>
          <button
            onClick={downloadJson}
            className="text-zinc-700 hover:text-zinc-400 uppercase tracking-widest text-[10px] transition-colors"
          >
            JSON
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="border-b border-zinc-900 shrink-0">
        <div
          className="h-px bg-zinc-300 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <div className="flex justify-between px-4 py-1.5 bg-zinc-950/50">
          <span className="text-zinc-700 uppercase tracking-widest text-[10px]">
            {status.replace(/_/g, " ").toUpperCase()}
          </span>
          <span className="text-zinc-600 text-[10px]">{progress}%</span>
        </div>
      </div>

      {/* ── Main body area (Scroll area or split area if failed) ── */}
      <div className="flex-1 flex flex-col min-h-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-1 select-text"
          aria-label="Investigation terminal logs"
          aria-live="polite"
          aria-atomic="false"
        >
          {events.length === 0 && (
            <p className="text-zinc-700 text-[10px] uppercase tracking-widest">
              Awaiting investigation pipeline...
            </p>
          )}
          {events.map((entry) => {
            const severity = getSeverity(entry);
            return (
              <div key={entry.id} className="flex items-start gap-3 leading-5">
                <span className="text-zinc-700 shrink-0 select-none tabular-nums w-16">
                  {formatTime(entry.createdAt)}
                </span>
                <span className="text-zinc-600 shrink-0 select-none w-8 uppercase">
                  {SEVERITY_PREFIX[severity].trim() || "·"}
                </span>
                <div className="flex-1">
                  <span className={`${SEVERITY_STYLES[severity]} break-all`}>
                    {entry.description}
                  </span>
                  {entry.duration && (
                    <span className="text-zinc-700 text-[10px] ml-2">
                      ({entry.duration}ms)
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Blinking cursor while live */}
          {!isTerminal && (
            <div className="flex items-center gap-3 mt-1">
              <span className="text-zinc-700 w-16">
                {new Date().toLocaleTimeString("en-GB", { hour12: false })}
              </span>
              <span className="inline-block w-1.5 h-3 bg-zinc-600 animate-pulse" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── Resume scroll button ── */}
        {!autoScroll && !isTerminal && (
          <div className="border-t border-zinc-900 px-4 py-2 flex justify-end shrink-0">
            <button
              onClick={() => {
                setAutoScroll(true);
                bottomRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
            >
              ↓ Resume Live
            </button>
          </div>
        )}

        {/* ── Diagnostics / Failure screen if failed ── */}
        {isFailedPipeline && (
          <div className="border-t border-zinc-800 bg-zinc-950 p-6 space-y-4 shrink-0 font-mono">
            <div className="border border-red-900/50 bg-red-950/10 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-bold uppercase tracking-widest text-xs">
                  ✕ PIPELINE ERROR DIAGNOSTICS
                </span>
                <span className="text-zinc-600 text-[10px]">
                  CORRELATION ID: {fatalEvent?.correlationId?.slice(0, 8).toUpperCase() || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-zinc-500 text-[11px] border-t border-zinc-900 pt-3">
                <div>
                  <span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Failed Stage</span>
                  <span className="text-zinc-300 font-semibold">{failedStage.replace(/_/g, " ").toUpperCase()}</span>
                </div>
                <div className="col-span-3">
                  <span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Failure Reason</span>
                  <span className="text-red-400">{failureReason}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-zinc-900 p-3 bg-black">
                <span className="block text-zinc-600 text-[10px] uppercase tracking-wider mb-2">Completed Stages</span>
                {completedStages.length === 0 ? (
                  <span className="text-zinc-500 italic">No stages completed successfully</span>
                ) : (
                  <ul className="space-y-1 text-zinc-300">
                    {completedStages.map((stg) => (
                      <li key={stg} className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-emerald-500">✓</span> {stg?.replace(/_/g, " ").toUpperCase()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="border border-zinc-900 p-3 bg-black">
                <span className="block text-zinc-600 text-[10px] uppercase tracking-wider mb-2">Successful Operations</span>
                {successfulOps.length === 0 ? (
                  <span className="text-zinc-500 italic">No operations succeeded</span>
                ) : (
                  <ul className="space-y-1 text-zinc-400 text-[11px] max-h-[80px] overflow-y-auto">
                    {successfulOps.map((op) => (
                      <li key={op.id} className="truncate">
                        <span className="text-emerald-500 mr-1.5">✓</span>
                        {op.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={downloadTxt}
                className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white uppercase tracking-widest transition-colors text-[10px]"
              >
                Download Logs
              </button>
              {onRetry && (
                <button
                  onClick={onRetry}
                  disabled={isRetrying}
                  className="px-5 py-2 bg-white text-black hover:bg-zinc-200 uppercase tracking-widest font-bold transition-colors disabled:opacity-50 text-[10px]"
                >
                  {isRetrying ? "RESTARTING..." : "RETRY INVESTIGATION"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between bg-zinc-950 shrink-0">
        <span className="text-zinc-700 text-[10px] uppercase tracking-widest">
          {events.length} events
        </span>
        {isTerminal && (
          <span
            className={`text-[10px] uppercase tracking-widest font-semibold ${
              status === "completed" ? "text-white animate-pulse" : "text-red-500"
            }`}
          >
            {status === "completed" ? "✓ PIPELINE COMPLETE" : "✕ PIPELINE FAILED"}
          </span>
        )}
      </div>
    </div>
  );
}
