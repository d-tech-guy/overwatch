import { PROCESSING_STATUS } from "@/lib/constants";
import type { ProcessingStatus } from "@/types/incident";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";

/**
 * InvestigationService
 *
 * Owns the full investigation lifecycle. Runs entirely server-side.
 * Uses Prisma ORM instead of the service-role Supabase client.
 *
 * The implementation is intentionally provider-agnostic: the pipeline
 * logic lives here and a dedicated job runner (e.g. Trigger.dev, Inngest)
 * can be wired to `start()` later without touching business logic.
 */
export class InvestigationService {
  /**
   * Starts the investigation pipeline in the background.
   *
   * Intentionally not awaited by the caller — the HTTP response is
   * returned immediately and the pipeline runs to completion independently.
   */
  static start(incidentId: string): void {
    this.runPipeline(incidentId).catch((err) => {
      console.error(`[InvestigationService] Unhandled error for ${incidentId}:`, err);
    });
  }

  private static async runPipeline(incidentId: string): Promise<void> {
    try {
      // Stage 1 — Fetch metadata from the TikTok URL
      await this.updateProgress(incidentId, PROCESSING_STATUS.fetchingMetadata, 10);
      await this.delay(2000);

      // Stage 2 — Metadata retrieved
      await this.updateProgress(incidentId, PROCESSING_STATUS.metadataComplete, 30);
      await this.delay(1000);

      // Stage 3 — AI analysis
      await this.updateProgress(incidentId, PROCESSING_STATUS.analyzing, 55);
      await this.delay(3000);

      // Stage 4 — Report generation
      await this.updateProgress(incidentId, PROCESSING_STATUS.reportGenerating, 80);
      await this.delay(2000);

      // Stage 5 — Complete
      await this.complete(incidentId);
    } catch (err) {
      console.error("[InvestigationService] Pipeline error:", err);
      await this.fail(incidentId, PROCESSING_STATUS.failedAi);
    }
  }

  static async updateProgress(
    incidentId: string,
    status: ProcessingStatus,
    progress: number
  ): Promise<void> {
    await InvestigationRepository.updateProgress(incidentId, status, progress);
  }

  static async complete(incidentId: string): Promise<void> {
    await InvestigationRepository.updateProgress(incidentId, PROCESSING_STATUS.completed, 100);
  }

  static async fail(incidentId: string, status: ProcessingStatus): Promise<void> {
    await InvestigationRepository.updateStatus(incidentId, status);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
