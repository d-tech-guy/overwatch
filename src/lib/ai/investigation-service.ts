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

import crypto from "crypto";
import { PROCESSING_STATUS } from "@/lib/constants";
import { InvestigationRepository } from "@/lib/db/repositories/investigation.repository";
import { ApifyMetadataProvider } from "@/lib/providers/metadata-provider";
import { runInvestigation } from "@/lib/ai/investigation";
import type { ApifyVideoMetadata, ApifyProfileMetadata, ApifyCommentMetadata } from "@/types/apify";

const provider = ApifyMetadataProvider;

export class InvestigationService {
  static async start(incidentId: string): Promise<void> {
    const correlationId = crypto.randomUUID();
    try {
      const { inngest } = await import("@/lib/inngest/client");
      await inngest.send({
        name: "investigation/created",
        data: { investigationId: incidentId },
      });
    } catch (error) {
      console.error("[InvestigationService] Failed to dispatch inngest event:", error);
      const reason = error instanceof Error ? error.message : "Failed to dispatch event";
      await InvestigationRepository.updateProgress(incidentId, PROCESSING_STATUS.failed, 0);
      await InvestigationRepository.logEvent(incidentId, "investigation_failed", `✕ Inngest dispatch failed: ${reason}`, 0, {
        stage: "queued",
        severity: "fatal",
        type: "inngest_failed",
        shortMessage: "Inngest dispatch failed",
        detailedMessage: reason,
        correlationId,
      });
    }
  }

  public static async runPipeline(incidentId: string): Promise<void> {
    const pipelineStart = Date.now();
    const correlationId = crypto.randomUUID();

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
      const urlStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.validatingUrl, 5, "Validating TikTok URL...", {
        correlationId,
        severity: "info",
      });

      // Simple mock check
      const isValid = videoUrl.includes("tiktok.com");
      const urlDuration = Date.now() - urlStart;

      if (!isValid) {
        throw new Error("Invalid TikTok URL format.");
      }

      await this.log(incidentId, "url_validated", "✓ URL validated", 5, {
        stage: PROCESSING_STATUS.validatingUrl,
        severity: "success",
        type: "url_validation_success",
        shortMessage: "URL validation succeeded",
        duration: urlDuration,
        correlationId,
      });

      // ------------------------------------------------------------------ //
      // Stage 2 — Fetch Video Metadata (10% → 25%)
      // ------------------------------------------------------------------ //
      const videoStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.fetchingVideoMetadata, 10, "Connecting to metadata provider...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "video_scraper_started", "Connecting to Apify...", 10, {
        stage: PROCESSING_STATUS.fetchingVideoMetadata,
        severity: "info",
        correlationId,
      });
      await this.log(incidentId, "video_scraper_started", "Video Scraper started...", 12, {
        stage: PROCESSING_STATUS.fetchingVideoMetadata,
        severity: "info",
        correlationId,
      });

      let video: ApifyVideoMetadata | null = null;
      try {
        video = await provider.getVideoMetadata(videoUrl);
        const videoDuration = Date.now() - videoStart;

        await this.progress(incidentId, PROCESSING_STATUS.videoMetadataComplete, 25, "Video metadata received", {
          correlationId,
          severity: "success",
          duration: videoDuration,
        });
        await InvestigationRepository.persistVideoMetadata(incidentId, video);

        await this.log(incidentId, "video_metadata_received", "Video metadata received", 25, {
          stage: PROCESSING_STATUS.videoMetadataComplete,
          severity: "success",
          type: "video_metadata_received",
          shortMessage: "Video metadata fetched successfully",
          duration: videoDuration,
          correlationId,
          metadataJson: video,
        });

        if (video.authorUsername) {
          await this.log(incidentId, "author_identified", `Author identified: @${video.authorUsername}`, 25, {
            stage: PROCESSING_STATUS.videoMetadataComplete,
            severity: "info",
            correlationId,
          });
        }
        if (video.caption) {
          await this.log(incidentId, "caption_indexed", "Caption indexed", 25, {
            stage: PROCESSING_STATUS.videoMetadataComplete,
            severity: "info",
            correlationId,
          });
        }
        if (video.hashtags.length) {
          await this.log(incidentId, "hashtags_indexed", `Hashtags indexed: ${video.hashtags.length} found`, 25, {
            stage: PROCESSING_STATUS.videoMetadataComplete,
            severity: "info",
            correlationId,
          });
        }
        if (video.views !== null) {
          await this.log(incidentId, "views_indexed", `Views indexed: ${video.views.toLocaleString()}`, 25, {
            stage: PROCESSING_STATUS.videoMetadataComplete,
            severity: "info",
            correlationId,
          });
        }
        if (video.likes !== null) {
          await this.log(incidentId, "likes_indexed", `Likes indexed: ${video.likes.toLocaleString()}`, 25, {
            stage: PROCESSING_STATUS.videoMetadataComplete,
            severity: "info",
            correlationId,
          });
        }
      } catch (err) {
        const reason = err instanceof Error ? err.message : "Unknown error";
        const duration = Date.now() - videoStart;
        await this.log(incidentId, "video_metadata_failed", `✕ Video metadata failed: ${reason}`, 10, {
          stage: PROCESSING_STATUS.fetchingVideoMetadata,
          severity: "error",
          type: "video_metadata_failed",
          shortMessage: "Failed to retrieve TikTok metadata",
          detailedMessage: reason,
          duration,
          correlationId,
        });
        await this.fail(incidentId, `Video metadata collection failed: ${reason}`, {
          stage: PROCESSING_STATUS.fetchingVideoMetadata,
          duration,
          correlationId,
        });
        return;
      }

      // ------------------------------------------------------------------ //
      // Stage 3 — Fetch Profile + Comments concurrently (25% → 55%)
      // ------------------------------------------------------------------ //
      const concurrentStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.fetchingProfile, 30, "Launching Profile and Comment scrapers...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "profile_scraper_started", "Launching Profile Scraper...", 30, {
        stage: PROCESSING_STATUS.fetchingProfile,
        severity: "info",
        correlationId,
      });
      await this.log(incidentId, "comments_scraper_started", "Launching Comment Scraper...", 30, {
        stage: PROCESSING_STATUS.fetchingComments,
        severity: "info",
        correlationId,
      });

      let profile: ApifyProfileMetadata | null = null;
      let comments: ApifyCommentMetadata[] = [];

      const [profileResult, commentsResult] = await Promise.allSettled([
        video.authorUsername ? provider.getProfile(video.authorUsername) : Promise.resolve(null),
        provider.getComments(videoUrl, 100),
      ]);

      const concurrentDuration = Date.now() - concurrentStart;

      // Handle profile result (Recoverable)
      if (profileResult.status === "fulfilled") {
        profile = profileResult.value;
        await this.progress(incidentId, PROCESSING_STATUS.profileComplete, 40, "Creator profile retrieved", {
          correlationId,
          severity: "success",
          duration: concurrentDuration,
        });
        if (profile) {
          await this.log(incidentId, "profile_retrieved", "Creator profile retrieved", 40, {
            stage: PROCESSING_STATUS.profileComplete,
            severity: "success",
            type: "profile_retrieved",
            shortMessage: "Profile retrieved successfully",
            correlationId,
            metadataJson: profile,
          });
          if (profile.followers !== null) {
            await this.log(incidentId, "follower_count_retrieved", `Follower count retrieved: ${profile.followers.toLocaleString()}`, 40, {
              stage: PROCESSING_STATUS.profileComplete,
              severity: "info",
              correlationId,
            });
          }
        }
      } else {
        const reason = profileResult.reason instanceof Error ? profileResult.reason.message : "Unknown";
        await this.log(incidentId, "profile_failed", `⚠ Profile could not be retrieved. Proceeding without profile enrichment.`, 40, {
          stage: PROCESSING_STATUS.fetchingProfile,
          severity: "warning",
          type: "profile_retrieved_warning",
          shortMessage: "Profile fetch failed, continuing without profile enrichment",
          detailedMessage: reason,
          duration: concurrentDuration,
          correlationId,
        });
      }

      // Handle comments result (Recoverable)
      if (commentsResult.status === "fulfilled") {
        comments = commentsResult.value;
        await this.progress(incidentId, PROCESSING_STATUS.commentsComplete, 55, "Comments retrieved", {
          correlationId,
          severity: "success",
          duration: concurrentDuration,
        });
        await this.log(incidentId, "comments_retrieved", `${comments.length} comments downloaded`, 55, {
          stage: PROCESSING_STATUS.commentsComplete,
          severity: "success",
          type: "comments_retrieved",
          shortMessage: "Comments downloaded successfully",
          correlationId,
          metadataJson: { count: comments.length },
        });
      } else {
        const reason = commentsResult.reason instanceof Error ? commentsResult.reason.message : "Unknown";
        await this.log(incidentId, "comments_failed", `⚠ TikTok comments unavailable. Continuing with partial investigation.`, 55, {
          stage: PROCESSING_STATUS.fetchingComments,
          severity: "warning",
          type: "comments_retrieved_warning",
          shortMessage: "Comments fetch failed, continuing with partial investigation",
          detailedMessage: reason,
          duration: concurrentDuration,
          correlationId,
        });
      }

      // ------------------------------------------------------------------ //
      // Stage 4 — Prepare AI Context (65%)
      // ------------------------------------------------------------------ //
      const contextStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.preparingAiContext, 65, "Preparing AI evidence package...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "ai_context_preparing", "Preparing AI evidence package...", 65, {
        stage: PROCESSING_STATUS.preparingAiContext,
        severity: "info",
        correlationId,
      });
      const contextDuration = Date.now() - contextStart;

      // ------------------------------------------------------------------ //
      // Stage 5 — Call Gemini with Retry Logic (80%)
      // ------------------------------------------------------------------ //
      await this.progress(incidentId, PROCESSING_STATUS.callingGemini, 70, "Submitting request to Gemini...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "gemini_request_started", "Submitting request to Gemini...", 70, {
        stage: PROCESSING_STATUS.callingGemini,
        severity: "info",
        correlationId,
      });

      let aiResult = null;
      let attempt = 1;
      const maxAttempts = 3;
      let lastAiError = null;

      while (attempt <= maxAttempts) {
        const geminiStart = Date.now();
        if (attempt > 1) {
          await this.log(incidentId, "gemini_retry_started", `Retry ${attempt - 1} Started...`, 70, {
            stage: PROCESSING_STATUS.callingGemini,
            severity: "warning",
            correlationId,
          });
        }
        await this.log(incidentId, "gemini_awaiting_response", `Awaiting AI response (Attempt ${attempt}/${maxAttempts})...`, 72, {
          stage: PROCESSING_STATUS.callingGemini,
          severity: "info",
          correlationId,
        });

        try {
          aiResult = await runInvestigation({ videoUrl, video, profile, comments });
          const geminiDuration = Date.now() - geminiStart;

          await this.progress(incidentId, PROCESSING_STATUS.aiAnalysisComplete, 80, "AI response received", {
            correlationId,
            severity: "success",
            duration: geminiDuration,
          });
          await this.log(incidentId, "gemini_response_received", "Gemini response received", 80, {
            stage: PROCESSING_STATUS.aiAnalysisComplete,
            severity: "success",
            type: "gemini_response_received",
            shortMessage: "Gemini analysis response retrieved",
            duration: geminiDuration,
            correlationId,
          });
          await this.log(incidentId, "extracting_schools", "Extracting schools...", 80, {
            stage: PROCESSING_STATUS.aiAnalysisComplete,
            severity: "info",
            correlationId,
          });
          await this.log(incidentId, "calculating_severity", `Calculating severity... [${aiResult.severity.toUpperCase()} — ${aiResult.severityScore}/100]`, 80, {
            stage: PROCESSING_STATUS.aiAnalysisComplete,
            severity: "info",
            correlationId,
          });
          await this.log(incidentId, "calculating_confidence", `Calculating confidence... [${aiResult.confidence}%]`, 80, {
            stage: PROCESSING_STATUS.aiAnalysisComplete,
            severity: "info",
            correlationId,
          });
          break; // success, break retry loop
        } catch (err) {
          lastAiError = err;
          const geminiDuration = Date.now() - geminiStart;
          await this.log(incidentId, "gemini_attempt_failed", `✕ Gemini request failed: ${err instanceof Error ? err.message : "Unknown AI error"}`, 70, {
            stage: PROCESSING_STATUS.callingGemini,
            severity: "warning",
            type: "gemini_attempt_failed",
            shortMessage: `Gemini request attempt ${attempt} failed`,
            detailedMessage: err instanceof Error ? err.message : "Unknown",
            duration: geminiDuration,
            correlationId,
          });
          attempt++;
        }
      }

      if (!aiResult) {
        const totalDuration = Date.now() - pipelineStart;
        const reason = lastAiError instanceof Error ? lastAiError.message : "All Gemini request attempts failed";
        await this.fail(incidentId, `Gemini request failed. All retries exhausted: ${reason}`, {
          stage: PROCESSING_STATUS.callingGemini,
          duration: totalDuration,
          correlationId,
        });
        return;
      }

      // ------------------------------------------------------------------ //
      // Stage 6 — Generate Report (90%)
      // ------------------------------------------------------------------ //
      const reportStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.generatingReport, 90, "Generating intelligence report...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "report_generating", "Generating intelligence report...", 90, {
        stage: PROCESSING_STATUS.generatingReport,
        severity: "info",
        correlationId,
      });
      const reportDuration = Date.now() - reportStart;

      // ------------------------------------------------------------------ //
      // Stage 7 — Save Results (95%)
      // ------------------------------------------------------------------ //
      const saveStart = Date.now();
      await this.progress(incidentId, PROCESSING_STATUS.savingResults, 95, "Persisting investigation...", {
        correlationId,
        severity: "info",
      });
      await this.log(incidentId, "saving_results", "Persisting investigation...", 95, {
        stage: PROCESSING_STATUS.savingResults,
        severity: "info",
        correlationId,
      });

      const processingMs = Date.now() - pipelineStart;
      await InvestigationRepository.completeInvestigation(incidentId, aiResult, profile, comments, processingMs);
      const saveDuration = Date.now() - saveStart;

      // ------------------------------------------------------------------ //
      // Stage 8 — Complete (100%)
      // ------------------------------------------------------------------ //
      await this.log(incidentId, "investigation_complete", "✓ Investigation Complete", 100, {
        stage: PROCESSING_STATUS.completed,
        severity: "success",
        type: "investigation_completed",
        shortMessage: "Investigation completed successfully",
        duration: processingMs,
        correlationId,
      });
      await this.log(incidentId, "report_generated", "Report Generated Successfully", 100, {
        stage: PROCESSING_STATUS.completed,
        severity: "success",
        type: "report_generated_success",
        shortMessage: "Report saved to database",
        correlationId,
      });

    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error";
      console.error("[InvestigationService] Pipeline error:", err);
      const duration = Date.now() - pipelineStart;
      await this.log(incidentId, "pipeline_failed", `✕ Investigation failed: ${reason}`, undefined, {
        stage: PROCESSING_STATUS.failed,
        severity: "fatal",
        type: "pipeline_failure",
        shortMessage: "Investigation pipeline failed",
        detailedMessage: reason,
        duration,
        correlationId,
      });
      await this.fail(incidentId, reason, {
        stage: PROCESSING_STATUS.failed,
        duration,
        correlationId,
      });
    }
  }

  private static async progress(
    id: string,
    status: string,
    progress: number,
    description: string,
    extra?: {
      severity?: string;
      type?: string;
      shortMessage?: string;
      detailedMessage?: string;
      duration?: number;
      correlationId?: string;
      metadataJson?: any;
    }
  ): Promise<void> {
    await InvestigationRepository.updateProgress(id, status, progress);
    await InvestigationRepository.logEvent(id, status, description, progress, {
      stage: status,
      severity: extra?.severity ?? "info",
      type: extra?.type ?? status,
      shortMessage: extra?.shortMessage ?? description,
      ...extra,
    });
  }

  private static async log(
    id: string,
    event: string,
    description: string,
    progress?: number,
    extra?: {
      stage?: string;
      severity?: string;
      type?: string;
      shortMessage?: string;
      detailedMessage?: string;
      duration?: number;
      correlationId?: string;
      metadataJson?: any;
    }
  ): Promise<void> {
    await InvestigationRepository.logEvent(id, event, description, progress, extra);
  }

  private static async fail(
    id: string,
    reason: string,
    extra?: {
      stage?: string;
      type?: string;
      duration?: number;
      correlationId?: string;
    }
  ): Promise<void> {
    await InvestigationRepository.updateProgress(id, PROCESSING_STATUS.failed, 0);
    await InvestigationRepository.logEvent(id, "investigation_failed", `✕ ${reason}`, 0, {
      stage: extra?.stage ?? "failed",
      severity: "fatal",
      type: extra?.type ?? "investigation_failed",
      shortMessage: reason,
      duration: extra?.duration,
      correlationId: extra?.correlationId,
    });
  }
}
