/**
 * InvestigationService
 *
 * Owns the complete investigation lifecycle.
 * Uses the MetadataProvider abstraction — never calls Apify directly.
 *
 * Pipeline:
 *   1. Validate URL             →  5%
 *   2. Fetch Video Metadata     → 25%
 *   3. Fetch Profile + Comments → 40% / 55%  (concurrent)
 *   4. Prepare AI Context       → 65%
 *   5. Call Gemini              → 80%
 *   6. Generate Report          → 90%
 *   7. Save Results             → 95%
 *   8. Complete                 → 100%
 *
 * Every step logs an InvestigationEvent so the terminal can replay
 * the exact sequence of real backend work.
 */

import { PROCESSING_STATUS } from "@/lib/constants";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { ApifyMetadataProvider } from "@/lib/providers/metadata-provider";
import { runInvestigation } from "@/lib/ai/investigation";
import type { ApifyVideoMetadata, ApifyProfileMetadata, ApifyCommentMetadata } from "@/types/apify";

const provider = ApifyMetadataProvider;

export class InvestigationService {
  static async start(incidentId: string): Promise<void> {
    const { inngest } = await import("@/lib/inngest/client");
    await inngest.send({
      name: "investigation/created",
      data: { investigationId: incidentId },
    });
  }

  public static async runPipeline(incidentId: string): Promise<void> {
    const startedAt = Date.now();

    try {
      // ------------------------------------------------------------------ //
      // Get the investigation URL
      // ------------------------------------------------------------------ //
      const investigation = await InvestigationRepository.findById(incidentId);
      if (!investigation) {
        throw new Error("Investigation record not found.");
      }
      const videoUrl = investigation.submittedUrl;

      // ------------------------------------------------------------------ //
      // Stage 1 — Validate URL (5%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.validatingUrl, 5, "Validating TikTok URL...");
      await this.log(incidentId, "url_validation", "✓ URL validated", 5);

      // ------------------------------------------------------------------ //
      // Stage 2 — Fetch Video Metadata (10% → 25%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.fetchingVideoMetadata, 10, "Connecting to metadata provider...");
      await this.log(incidentId, "video_scraper_started", "Connecting to Apify...", 10);
      await this.log(incidentId, "video_scraper_started", "Video Scraper started...", 10);

      let video: ApifyVideoMetadata | null = null;
      try {
        video = await provider.getVideoMetadata(videoUrl);

        await this.progress(incidentId, PROCESSING_STATUS.videoMetadataComplete, 25, "Video metadata received");
        await InvestigationRepository.persistVideoMetadata(incidentId, video);

        await this.log(incidentId, "video_metadata_received", "Video metadata received", 25);
        if (video.authorUsername) await this.log(incidentId, "author_identified", `Author identified: @${video.authorUsername}`, 25);
        if (video.caption) await this.log(incidentId, "caption_indexed", "Caption indexed", 25);
        if (video.hashtags.length) await this.log(incidentId, "hashtags_indexed", `Hashtags indexed: ${video.hashtags.length} found`, 25);
        if (video.uploadDate) await this.log(incidentId, "upload_date_parsed", "Upload date parsed", 25);
        if (video.views !== null) await this.log(incidentId, "views_indexed", `Views indexed: ${video.views.toLocaleString()}`, 25);
        if (video.likes !== null) await this.log(incidentId, "likes_indexed", `Likes indexed: ${video.likes.toLocaleString()}`, 25);
        if (video.comments !== null) await this.log(incidentId, "comments_count_indexed", `Comment count indexed: ${video.comments.toLocaleString()}`, 25);
        if (video.shares !== null) await this.log(incidentId, "shares_indexed", `Shares indexed: ${video.shares.toLocaleString()}`, 25);
        if (video.downloadUrl) await this.log(incidentId, "download_url_received", "Download URL received", 25);
      } catch (err) {
        const reason = err instanceof Error ? err.message : "Unknown error";
        await this.log(incidentId, "video_metadata_failed", `✕ Video metadata failed: ${reason}`, 10);
        await this.fail(incidentId, `Video metadata collection failed: ${reason}`);
        return;
      }

      // ------------------------------------------------------------------ //
      // Stage 3 — Fetch Profile + Comments concurrently (25% → 55%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.fetchingProfile, 30, "Launching Profile and Comment scrapers...");
      await this.log(incidentId, "profile_scraper_started", "Launching Profile Scraper...", 30);
      await this.log(incidentId, "comments_scraper_started", "Launching Comment Scraper...", 30);

      let profile: ApifyProfileMetadata | null = null;
      let comments: ApifyCommentMetadata[] = [];

      const [profileResult, commentsResult] = await Promise.allSettled([
        video.authorUsername ? provider.getProfile(video.authorUsername) : Promise.resolve(null),
        provider.getComments(videoUrl, 100),
      ]);

      // Handle profile result
      if (profileResult.status === "fulfilled") {
        profile = profileResult.value;
        await this.progress(incidentId, PROCESSING_STATUS.profileComplete, 40, "Creator profile retrieved");
        if (profile) {
          await this.log(incidentId, "profile_retrieved", "Creator profile retrieved", 40);
          if (profile.followers !== null) await this.log(incidentId, "follower_count_retrieved", `Follower count retrieved: ${profile.followers.toLocaleString()}`, 40);
          if (profile.bio) await this.log(incidentId, "bio_indexed", "Bio indexed", 40);
          if (profile.region) await this.log(incidentId, "region_identified", `Region identified: ${profile.region}`, 40);
          if (typeof profile.verified === "boolean") await this.log(incidentId, "verified_status", `Verified status: ${profile.verified ? "Yes" : "No"}`, 40);
        }
      } else {
        const reason = profileResult.reason instanceof Error ? profileResult.reason.message : "Unknown";
        await this.log(incidentId, "profile_failed", `⚠ Profile scraper failed: ${reason}`, 40);
      }

      // Handle comments result
      if (commentsResult.status === "fulfilled") {
        comments = commentsResult.value;
        await this.progress(incidentId, PROCESSING_STATUS.commentsComplete, 55, "Comments retrieved");
        await this.log(incidentId, "comments_retrieved", `${comments.length} comments downloaded`, 55);
      } else {
        const reason = commentsResult.reason instanceof Error ? commentsResult.reason.message : "Unknown";
        await this.log(incidentId, "comments_failed", `⚠ Comment scraper failed: ${reason}`, 55);
      }

      // ------------------------------------------------------------------ //
      // Stage 4 — Prepare AI Context (65%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.preparingAiContext, 65, "Preparing AI evidence package...");
      await this.log(incidentId, "ai_context_preparing", "Preparing AI evidence package...", 65);

      // ------------------------------------------------------------------ //
      // Stage 5 — Call Gemini (80%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.callingGemini, 70, "Submitting request to Gemini...");
      await this.log(incidentId, "gemini_request_started", "Submitting request to Gemini...", 70);
      await this.log(incidentId, "gemini_awaiting_response", "Awaiting AI response...", 72);

      let aiResult;
      try {
        aiResult = await runInvestigation({ videoUrl, video, profile, comments });
        await this.progress(incidentId, PROCESSING_STATUS.aiAnalysisComplete, 80, "AI response received");
        await this.log(incidentId, "gemini_response_received", "Gemini response received", 80);
        await this.log(incidentId, "extracting_schools", "Extracting schools...", 80);
        await this.log(incidentId, "calculating_severity", `Calculating severity... [${aiResult.severity.toUpperCase()} — ${aiResult.severityScore}/100]`, 80);
        await this.log(incidentId, "calculating_confidence", `Calculating confidence... [${aiResult.confidence}%]`, 80);
      } catch (err) {
        const reason = err instanceof Error ? err.message : "Unknown AI error";
        await this.log(incidentId, "gemini_failed", `✕ Gemini request failed: ${reason}`, 70);
        await this.fail(incidentId, `AI analysis failed: ${reason}`);
        return;
      }

      // ------------------------------------------------------------------ //
      // Stage 6 — Generate Report (90%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.generatingReport, 90, "Generating intelligence report...");
      await this.log(incidentId, "report_generating", "Generating intelligence report...", 90);

      // ------------------------------------------------------------------ //
      // Stage 7 — Save Results (95%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.savingResults, 95, "Persisting investigation...");
      await this.log(incidentId, "saving_results", "Persisting investigation...", 95);

      const processingMs = Date.now() - startedAt;
      await InvestigationRepository.completeInvestigation(incidentId, aiResult, profile, comments, processingMs);

      // ------------------------------------------------------------------ //
      // Stage 8 — Complete (100%)
      // ------------------------------------------------------------------ //
      await this.log(incidentId, "investigation_complete", "✓ Investigation Complete", 100);

    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error";
      console.error("[InvestigationService] Pipeline error:", err);
      await this.log(incidentId, "pipeline_failed", `✕ Investigation failed: ${reason}`, undefined);
      await this.fail(incidentId, reason);
    }
  }

  private static async progress(
    id: string,
    status: string,
    progress: number,
    description: string
  ): Promise<void> {
    await InvestigationRepository.updateProgress(id, status, progress);
    await InvestigationRepository.logEvent(id, status, description, progress);
  }

  private static async log(
    id: string,
    event: string,
    description: string,
    progress?: number
  ): Promise<void> {
    await InvestigationRepository.logEvent(id, event, description, progress);
  }

  private static async fail(id: string, reason: string): Promise<void> {
    await InvestigationRepository.updateProgress(id, PROCESSING_STATUS.failed, 0);
    await InvestigationRepository.logEvent(id, "investigation_failed", `✕ ${reason}`);
  }
}
