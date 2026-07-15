import { prisma } from "../prisma";
import type { Prisma } from "@prisma/client";

export class InvestigationRepository {
  static async findById(id: string) {
    return prisma.investigation.findUnique({
      where: { id },
    });
  }

  static async createWithEventAndEvidence(
    data: Prisma.InvestigationCreateInput,
    eventDescription: string,
    evidenceContent: string,
    evidenceSource: string
  ) {
    return prisma.$transaction(async (tx) => {
      const investigation = await tx.investigation.create({
        data,
      });

      await tx.investigationEvent.create({
        data: {
          investigationId: investigation.id,
          event: "investigation_created",
          description: eventDescription,
          progress: 0,
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
    // Map string to enum type if needed, but Prisma accepts strings for enums
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
      data: {
        processingStatus: processingStatus as any,
      },
    });
  }

  static async completeInvestigation(id: string, aiResponseJson: any, summary?: string, explanation?: string, sentiment?: string, severity?: string, riskScore?: number, confidenceScore?: number, detectedSchoolId?: string, detectedLocation?: string) {
    return prisma.investigation.update({
      where: { id },
      data: {
        processingStatus: "completed",
        progress: 100,
        completedAt: new Date(),
        aiResponseJson,
        summary,
        explanation,
        sentiment,
        severity: severity as any,
        riskScore,
        confidenceScore,
        detectedSchoolId,
        detectedLocation,
      },
    });
  }
}
