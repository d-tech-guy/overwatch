"use server";

import { createClient } from "@/lib/supabase/server";
import { tiktokUrlSchema } from "@/lib/validators";
import { PROCESSING_STATUS, INVESTIGATION_STATUS } from "@/lib/constants";
import { InvestigationService } from "@/lib/ai/investigation-service";
import { insertIncident } from "@/lib/db/incidents";

export async function submitIncident(
  formData: FormData
): Promise<{ id: string; publicToken: string } | { error: string }> {
  const url = formData.get("url");

  if (typeof url !== "string") {
    return { error: "A TikTok URL is required." };
  }

  const validation = tiktokUrlSchema.safeParse(url);
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  const supabase = await createClient();

  // Generate a cryptographically random public token.
  // This acts as an unguessable bearer credential for the SSE stream.
  const publicToken = crypto.randomUUID();

  const result = await insertIncident(supabase, {
    tiktok_url: validation.data,
    processing_status: PROCESSING_STATUS.queued,
    investigation_status: INVESTIGATION_STATUS.pendingReview,
    progress: 0,
    public_token: publicToken,
    priority: "Low",
  });

  if (!result) {
    return { error: "Failed to create investigation. Please try again." };
  }

  // Start the background pipeline. Not awaited — the HTTP response
  // is returned immediately and the service runs independently.
  InvestigationService.start(result.id);

  return { id: result.id, publicToken };
}
