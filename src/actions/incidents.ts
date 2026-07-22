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
        processingStatus: PROCESSING_STATUS.queued as import("@prisma/client").ProcessingStatus,
        investigationStatus: INVESTIGATION_STATUS.pendingReview as import("@prisma/client").InvestigationStatus,
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

export async function getInvestigationState(id: string) {
  try {
    const investigation = await InvestigationRepository.findById(id);
    if (!investigation) {
      return { error: "Investigation not found" };
    }
    return {
      status: investigation.processingStatus,
      progress: investigation.progress,
      events: investigation.events.map((e) => ({
        id: e.id,
        event: e.event,
        description: e.description ?? "",
        createdAt: e.createdAt.toISOString(),
        progress: e.progress,
        stage: e.stage,
        severity: e.severity,
        type: e.type,
        shortMessage: e.shortMessage,
        detailedMessage: e.detailedMessage,
        duration: e.duration,
        correlationId: e.correlationId,
        metadataJson: e.metadataJson,
      })),
    };
  } catch (error) {
    console.error("[getInvestigationState] Error:", error);
    return { error: "Failed to fetch investigation state" };
  }
}

export async function retryInvestigation(id: string) {
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const investigation = await InvestigationRepository.findById(id);
    if (!investigation) {
      return { error: "Investigation not found" };
    }

    // Reset status and progress
    await InvestigationRepository.updateProgress(id, PROCESSING_STATUS.queued, 0);

    // Delete old events to start fresh
    await prisma.investigationEvent.deleteMany({
      where: { investigationId: id },
    });

    // Start background job again
    InvestigationService.start(id);

    return { success: true };
  } catch (error) {
    console.error("[retryInvestigation] Error:", error);
    return { error: "Failed to restart investigation" };
  }
}
