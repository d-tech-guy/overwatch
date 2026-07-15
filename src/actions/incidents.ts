"use server";

import { tiktokUrlSchema } from "@/lib/validators";
import { PROCESSING_STATUS, INVESTIGATION_STATUS } from "@/lib/constants";
import { InvestigationService } from "@/lib/ai/investigation-service";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";

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

  try {
    const result = await InvestigationRepository.createWithEventAndEvidence(
      {
        submittedUrl: validation.data,
        processingStatus: PROCESSING_STATUS.queued as any,
        investigationStatus: INVESTIGATION_STATUS.pendingReview as any,
        progress: 0,
      },
      "Investigation initiated",
      "URL submitted",
      "User Submission"
    );

    // Start the background pipeline. Not awaited — the HTTP response
    // is returned immediately and the service runs independently.
    InvestigationService.start(result.id);

    return { id: result.id, publicToken: result.publicId };
  } catch (error) {
    console.error("[submitIncident] Error:", error);
    return { error: "Failed to create investigation. Please try again." };
  }
}
