"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TerminalEvent {
  id: string;
  event: string;
  description: string;
  createdAt: string;
  progress?: number | null;
}

type Severity = "success" | "error" | "warning" | "info";

function getSeverity(description: string): Severity {
  if (description.startsWith("✓")) return "success";
  if (description.startsWith("✕")) return "error";
  if (description.startsWith("⚠")) return "warning";
  return "info";
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour12: false });
}

const SEVERITY_STYLES: Record<Severity, string> = {
  success: "text-white",
  error: "text-zinc-400",
  warning: "text-zinc-400",
  info: "text-zinc-500",
};

const SEVERITY_PREFIX: Record<Severity, string> = {
  success: "OK  ",
  error: "ERR ",
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
  /** Called when the investigation reaches a terminal state (completed or failed). */
  onComplete?: (status: "completed" | "failed") => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * InvestigationTerminalRealtime
 *
 * A live operational console that renders backend investigation events
 * as they occur. Every log line originates from a real backend operation.
 *
 * Connects to Supabase Realtime directly from the client for zero-poll updates.
 */
export function InvestigationTerminalRealtime({
  investigationId,
  publicToken,
  initialEvents,
  initialStatus,
  initialProgress,
  onComplete,
}: InvestigationTerminalRealtimeProps) {
  const [events, setEvents] = useState<TerminalEvent[]>(initialEvents);
  const [status, setStatus] = useState(initialStatus);
  const [progress, setProgress] = useState(initialProgress);
  const [connected, setConnected] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

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
        setConnected(subStatus === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
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
      .map((e) => `[${formatTime(e.createdAt)}] ${SEVERITY_PREFIX[getSeverity(e.description)]}${e.description}`)
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

  return (
    <div className="border border-zinc-800 bg-black font-mono text-xs">
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
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
      <div className="border-b border-zinc-900">
        <div
          className="h-px bg-zinc-300 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
        <div className="flex justify-between px-4 py-1.5">
          <span className="text-zinc-700 uppercase tracking-widest text-[10px]">
            {status.replace(/_/g, " ").toUpperCase()}
          </span>
          <span className="text-zinc-600 text-[10px]">{progress}%</span>
        </div>
      </div>

      {/* ── Log area ── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-80 overflow-y-auto p-4 space-y-0.5"
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
          const severity = getSeverity(entry.description);
          return (
            <div key={entry.id} className="flex items-start gap-3 leading-5">
              <span className="text-zinc-700 shrink-0 select-none tabular-nums w-16">
                {formatTime(entry.createdAt)}
              </span>
              <span className="text-zinc-600 shrink-0 select-none w-8 uppercase">
                {SEVERITY_PREFIX[severity].trim() || "·"}
              </span>
              <span className={`${SEVERITY_STYLES[severity]} break-all`}>
                {entry.description}
              </span>
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
        <div className="border-t border-zinc-900 px-4 py-2 flex justify-end">
          <button
            onClick={() => {
              setAutoScroll(true);
              bottomRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-zinc-600 hover:text-white text-[10px] uppercase tracking-widest transition-colors"
          >
            ↓ Resume Auto-Scroll
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between">
        <span className="text-zinc-700 text-[10px] uppercase tracking-widest">
          {events.length} events
        </span>
        {isTerminal && (
          <span
            className={`text-[10px] uppercase tracking-widest font-semibold ${
              status === "completed" ? "text-white" : "text-zinc-500"
            }`}
          >
            {status === "completed" ? "✓ PIPELINE COMPLETE" : "✕ PIPELINE FAILED"}
          </span>
        )}
      </div>
    </div>
  );
}
