import { type NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getIncidentStatus } from "@/lib/db/incidents";
import { PROCESSING_STATUS } from "@/lib/constants";
import type { ProcessingStatus } from "@/types/incident";

// Use Node.js runtime — required for streaming responses on Vercel.
export const runtime = "nodejs";

// The set of processing statuses that terminate the investigation.
const TERMINAL_STATUSES = new Set<ProcessingStatus>([
  PROCESSING_STATUS.completed,
  PROCESSING_STATUS.failedMetadata,
  PROCESSING_STATUS.failedAi,
]);

/**
 * GET /api/investigations/[id]/stream
 *
 * Streams Server-Sent Events (SSE) for a specific investigation.
 *
 * Security: The caller must supply the `token` query parameter matching
 * the incident's `public_token`. The server validates this before streaming
 * any data, ensuring no investigation data is exposed without authorization.
 *
 * The stream polls the database every 2 seconds and emits a `status` event
 * on every change. It closes automatically when the investigation reaches a
 * terminal state (completed, failed_metadata, or failed_ai).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Missing token parameter." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Verify the incident exists and the token matches before opening the stream.
  const incident = await getIncidentStatus(supabase, id);

  if (!incident) {
    return NextResponse.json({ error: "Investigation not found." }, { status: 404 });
  }

  if (incident.public_token !== token) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }

  // Build the SSE stream.
  const encoder = new TextEncoder();
  const POLL_INTERVAL_MS = 2000;

  const stream = new ReadableStream({
    async start(controller) {
      let lastStatus = incident.processing_status;
      let lastProgress = incident.progress;

      // Emit the current state immediately so the client doesn't wait.
      controller.enqueue(encoder.encode(formatEvent(lastStatus, lastProgress)));

      if (TERMINAL_STATUSES.has(lastStatus)) {
        controller.close();
        return;
      }

      const interval = setInterval(async () => {
        try {
          const current = await getIncidentStatus(supabase, id);

          if (!current) {
            clearInterval(interval);
            controller.close();
            return;
          }

          // Only emit when something has changed.
          if (
            current.processing_status !== lastStatus ||
            current.progress !== lastProgress
          ) {
            lastStatus = current.processing_status;
            lastProgress = current.progress;
            controller.enqueue(
              encoder.encode(formatEvent(lastStatus, lastProgress))
            );
          }

          // Close stream on terminal state.
          if (TERMINAL_STATUSES.has(current.processing_status)) {
            clearInterval(interval);
            controller.close();
          }
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, POLL_INTERVAL_MS);

      // Clean up if the client disconnects.
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

function formatEvent(status: ProcessingStatus, progress: number): string {
  return `data: ${JSON.stringify({ status, progress })}\n\n`;
}
