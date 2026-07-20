import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";
import type { GeminiInvestigationResult } from "@/lib/ai/investigation";
import type { ApifyVideoMetadata, ApifyProfileMetadata, ApifyCommentMetadata } from "@/types/apify";

export class InvestigationRepository {
  static async findById(id: string) {
    return prisma.investigation.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { createdAt: "asc" },
        },
        evidence: true,
        school: true,
      },
    });
  }

  static async createWithEventAndEvidence(
    data: Prisma.InvestigationCreateInput,
    eventDescription: string,
    evidenceContent: string,
    evidenceSource: string
  ) {
    return prisma.$transaction(async (tx) => {
      const investigation = await tx.investigation.create({ data });

      await tx.investigationEvent.create({
        data: {
          investigationId: investigation.id,
          event: "investigation_created",
          description: eventDescription,
          progress: 0,
          stage: "queued",
          severity: "info",
          type: "investigation_created",
          shortMessage: "Investigation initiated",
        },
      });

      await tx.evidence.create({
        data: {
          investigationId: investigation.id,
          type: "metadata",
          content: evidenceContent,
          source: evidenceSource,
        },
      });

      return investigation;
    });
  }

  static async updateProgress(id: string, processingStatus: string, progress: number) {
    return prisma.investigation.update({
      where: { id },
      data: {
        processingStatus: processingStatus as any,
        progress,
      },
    });
  }

  static async updateStatus(id: string, processingStatus: string) {
    return prisma.investigation.update({
      where: { id },
      data: { processingStatus: processingStatus as any },
    });
  }

  /** Persist an investigation event (terminal log entry). */
  static async logEvent(
    investigationId: string,
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
  ) {
    return prisma.investigationEvent.create({
      data: {
        investigationId,
        event,
        description,
        progress,
        stage: extra?.stage,
        severity: extra?.severity,
        type: extra?.type,
        shortMessage: extra?.shortMessage,
        detailedMessage: extra?.detailedMessage,
        duration: extra?.duration,
        correlationId: extra?.correlationId,
        metadataJson: extra?.metadataJson ? (extra.metadataJson as any) : undefined,
      },
    });
  }

  /** Persist extracted video metadata into the investigation row. */
  static async persistVideoMetadata(id: string, video: ApifyVideoMetadata) {
    return prisma.investigation.update({
      where: { id },
      data: {
        authorUsername: video.authorUsername ?? undefined,
        caption: video.caption ?? undefined,
        uploadTimestamp: video.uploadDate ? new Date(video.uploadDate) : undefined,
        hashtags: video.hashtags,
        likeCount: video.likes ?? undefined,
        commentCount: video.comments ?? undefined,
        shareCount: video.shares ?? undefined,
      },
    });
  }

  /** Persist AI JSON result and complete the investigation. */
  static async completeInvestigation(
    id: string,
    aiResult: GeminiInvestigationResult,
    profile: ApifyProfileMetadata | null,
    comments: ApifyCommentMetadata[],
    processingMs: number
  ) {
    return prisma.$transaction(async (tx) => {
      // Update the main investigation with AI findings
      await tx.investigation.update({
        where: { id },
        data: {
          processingStatus: "completed" as any,
          progress: 100,
          completedAt: new Date(),
          aiResponseJson: {
            ...aiResult,
            processingMs,
            geminiModel: "gemini-2.0-flash",
            commentsRetrieved: comments.length,
            profile,
          } as any,
          summary: aiResult.summary,
          explanation: aiResult.explanation,
          sentiment: aiResult.sentiment,
          severity: aiResult.severity as any,
          riskScore: aiResult.severityScore,
          confidenceScore: aiResult.confidence,
          detectedLocation: aiResult.location ?? undefined,
        },
      });

      // Persist AI evidence items
      if (aiResult.evidence.length > 0) {
        await tx.evidence.createMany({
          data: aiResult.evidence.map((content) => ({
            investigationId: id,
            type: "ai_evidence" as any,
            content,
            source: "Gemini AI",
          })),
        });
      }

      // Persist comment evidence (first 20 for the report)
      if (comments.length > 0) {
        await tx.evidence.createMany({
          data: comments.slice(0, 20).map((c) => ({
            investigationId: id,
            type: "comment" as any,
            content: `@${c.author ?? "unknown"}: ${c.text ?? ""}`,
            source: "TikTok Comments",
          })),
        });
      }

      // Threat Intelligence Extraction
      if (profile && profile.username) {
        await tx.creator.upsert({
          where: { creatorId: profile.username },
          update: {
            username: profile.username,
            displayName: profile.displayName,
            followerCount: profile.followers,
            verificationStatus: profile.verified || false,
            lastSeen: new Date(),
          },
          create: {
            creatorId: profile.username,
            username: profile.username,
            displayName: profile.displayName,
            followerCount: profile.followers,
            verificationStatus: profile.verified || false,
          },
        });
      }

      // Extract Hashtags (we need to get video metadata from the DB to extract hashtags, or pass it into completeInvestigation)
      // Since video metadata isn't passed into completeInvestigation, we fetch it first.
      const inv = await tx.investigation.findUnique({ where: { id }, select: { hashtags: true } });
      if (inv && inv.hashtags && inv.hashtags.length > 0) {
        for (const tag of inv.hashtags) {
          const lowerTag = tag.toLowerCase().replace('#', '');
          await tx.hashtag.upsert({
            where: { hashtag: lowerTag },
            update: { frequency: { increment: 1 }, lastSeen: new Date() },
            create: { hashtag: lowerTag, frequency: 1 },
          });
        }
      }
    });
  }
}
