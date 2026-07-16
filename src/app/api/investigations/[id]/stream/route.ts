import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { PROCESSING_STATUS } from "@/lib/constants";
import type { Database } from "@/types/database";

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
 * Streams Server-Sent Events using Supabase Realtime.
 * Subscribes to changes on `investigation_events` and `investigations` tables
 * and forwards them to the connected client with zero polling.
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

  // Use service-role key to bypass RLS for the realtime subscription
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null;

  const stream = new ReadableStream({
    async start(ctrl) {
      controller = ctrl;

      // Emit current state immediately so the client has a starting snapshot
      const initialLogs = (incident.events ?? []).map((e) => ({
        id: e.id,
        event: e.event,
        description: e.description ?? "",
        createdAt: e.createdAt.toISOString(),
      }));

      const initialPayload: StreamPayload = {
        status: incident.processingStatus as string,
        progress: incident.progress,
        logs: initialLogs,
      };

      ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(initialPayload)}\n\n`));

      if (TERMINAL_STATUSES.has(incident.processingStatus as string)) {
        ctrl.close();
        supabase.removeAllChannels();
        return;
      }

      // Subscribe to new investigation_events for this investigation via Realtime
      const channel = supabase
        .channel(`investigation-stream:${id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "investigation_events",
            filter: `investigation_id=eq.${id}`,
          },
          (payload) => {
            if (!controller) return;
            const row = payload.new as {
              id: string;
              event: string;
              description: string;
              created_at: string;
              progress: number | null;
            };
            const eventPayload: StreamPayload = {
              status: "", // will be overridden by next investigation update
              progress: row.progress ?? 0,
              logs: [
                {
                  id: row.id,
                  event: row.event,
                  description: row.description ?? "",
                  createdAt: row.created_at,
                },
              ],
            };
            try {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(eventPayload)}\n\n`));
            } catch {
              // Client disconnected
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "investigations",
            filter: `id=eq.${id}`,
          },
          (payload) => {
            if (!controller) return;
            const row = payload.new as {
              processing_status: string;
              progress: number;
            };

            const statusPayload: StreamPayload = {
              status: row.processing_status,
              progress: row.progress,
              logs: [],
            };

            try {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(statusPayload)}\n\n`)
              );
            } catch {
              // Client disconnected
            }

            // Close stream when investigation reaches terminal state
            if (TERMINAL_STATUSES.has(row.processing_status)) {
              supabase.removeChannel(channel);
              try {
                controller.close();
              } catch {
                // Already closed
              }
              controller = null;
            }
          }
        )
        .subscribe();

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        supabase.removeChannel(channel);
        try {
          ctrl.close();
        } catch {
          // Already closed
        }
        controller = null;
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
