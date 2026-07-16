import { type NextRequest, NextResponse } from "next/server";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { PROCESSING_STATUS } from "@/lib/constants";

export const runtime = "nodejs";

const TERMINAL_STATUSES = new Set<string>([
  PROCESSING_STATUS.completed,
  PROCESSING_STATUS.failed,
]);

export interface StreamPayload {
  status: string;
  progress: number;
  logs: Array<{ id: string; event: string; description: string; createdAt: string }>;
}

/**
 * GET /api/investigations/[id]/stream
 *
 * Streams Server-Sent Events for a specific investigation.
 * Emits both status/progress updates AND new InvestigationEvent log entries,
 * allowing the terminal to display real backend work in real time.
 *
 * Security: caller must supply ?token=<publicId>
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token parameter." }, { status: 400 });
  }

  const incident = await InvestigationRepository.findById(id);

  if (!incident) {
    return NextResponse.json({ error: "Investigation not found." }, { status: 404 });
  }

  if (incident.publicId !== token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  const encoder = new TextEncoder();
  const POLL_INTERVAL_MS = 1500;

  const stream = new ReadableStream({
    async start(controller) {
      let lastStatus = incident.processingStatus as string;
      let lastProgress = incident.progress;
      let lastEventId = "";

      // Emit current state immediately
      const initialLogs = (incident.events ?? []).map((e) => ({
        id: e.id,
        event: e.event,
        description: e.description ?? "",
        createdAt: e.createdAt.toISOString(),
      }));

      if (initialLogs.length > 0) {
        lastEventId = initialLogs[initialLogs.length - 1].id;
      }

      const initialPayload: StreamPayload = {
        status: lastStatus,
        progress: lastProgress,
        logs: initialLogs,
      };
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialPayload)}\n\n`));

      if (TERMINAL_STATUSES.has(lastStatus)) {
        controller.close();
        return;
      }

      const interval = setInterval(async () => {
        try {
          const current = await InvestigationRepository.findById(id);
          if (!current) {
            clearInterval(interval);
            controller.close();
            return;
          }

          const currentStatus = current.processingStatus as string;
          const currentProgress = current.progress;

          // Find new events since last emit
          const allEvents = current.events ?? [];
          const lastIdx = lastEventId
            ? allEvents.findIndex((e) => e.id === lastEventId)
            : -1;
          const newEvents = lastIdx >= 0
            ? allEvents.slice(lastIdx + 1)
            : allEvents;

          const newLogs = newEvents.map((e) => ({
            id: e.id,
            event: e.event,
            description: e.description ?? "",
            createdAt: e.createdAt.toISOString(),
          }));

          if (newLogs.length > 0) {
            lastEventId = newLogs[newLogs.length - 1].id;
          }

          const hasChange =
            currentStatus !== lastStatus ||
            currentProgress !== lastProgress ||
            newLogs.length > 0;

          if (hasChange) {
            lastStatus = currentStatus;
            lastProgress = currentProgress;

            const payload: StreamPayload = {
              status: currentStatus,
              progress: currentProgress,
              logs: newLogs,
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }

          if (TERMINAL_STATUSES.has(currentStatus)) {
            clearInterval(interval);
            controller.close();
          }
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, POLL_INTERVAL_MS);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
