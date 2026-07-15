/**
 * Typed data-access functions for the incidents table.
 *
 * These functions wrap raw Supabase queries and return results typed against
 * our own domain interfaces (IncidentRow), rather than relying on Supabase's
 * internal generic resolution which can be brittle with hand-authored Database types.
 *
 * All functions are server-only. Never import in Client Components.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { IncidentRow, ProcessingStatus } from "@/types/incident";

// ---------------------------------------------------------------------------
// Type for the columns we select when polling the SSE stream
// ---------------------------------------------------------------------------

export interface IncidentStatusRow {
  id: string;
  processing_status: ProcessingStatus;
  progress: number;
  public_token: string;
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * Creates a new incident row and returns its id.
 */
export async function insertIncident(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  payload: {
    tiktok_url: string;
    processing_status: string;
    investigation_status: string;
    progress: number;
    public_token: string;
    priority: string;
  }
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from("incidents")
    .insert(payload)
    .select("id")
    .single();

  if (error || !data) {
    console.error("[db/incidents] insertIncident error:", error);
    return null;
  }

  return data as { id: string };
}

/**
 * Reads the status columns for a single incident.
 */
export async function getIncidentStatus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  id: string
): Promise<IncidentStatusRow | null> {
  const { data, error } = await supabase
    .from("incidents")
    .select("id, processing_status, progress, public_token")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as IncidentStatusRow;
}

/**
 * Updates the processing status and progress of an incident.
 */
export async function updateIncidentProgress(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  id: string,
  processing_status: string,
  progress: number
): Promise<void> {
  const { error } = await supabase
    .from("incidents")
    .update({ processing_status, progress, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[db/incidents] updateIncidentProgress error:", error);
  }
}

/**
 * Updates the processing status without changing progress (e.g. for failure states).
 */
export async function updateIncidentStatus(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  id: string,
  processing_status: string
): Promise<void> {
  const { error } = await supabase
    .from("incidents")
    .update({ processing_status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[db/incidents] updateIncidentStatus error:", error);
  }
}
