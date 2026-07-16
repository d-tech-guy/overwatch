import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

export interface RaidParams {
  institutionId?: string;
  keywords?: string[];
  hashtags?: string[];
  creators?: string[];
  configuration?: Record<string, unknown>;
}

export class RaidService {
  /**
   * Initializes a new Raid record in the database and dispatches it to
   * the Inngest background worker queue.
   */
  static async initiateRaid(params: RaidParams) {
    const raid = await prisma.raid.create({
      data: {
        institutionId: params.institutionId,
        keywords: params.keywords || [],
        hashtags: params.hashtags || [],
        creators: params.creators || [],
        configuration: (params.configuration ?? undefined) as Prisma.InputJsonValue | undefined,
        status: "queued",
      },
    });

    console.log(`[RaidEngine] Initialized Raid ${raid.id}`);

    // Dispatch to Inngest background worker — replaces the old setTimeout stub
    await inngest.send({
      name: "raid/created",
      data: { raidId: raid.id },
    });

    return raid;
  }

  /**
   * Asynchronous raid executor called by the Inngest worker.
   * In production this will call Apify to search TikTok by keywords/hashtags.
   */
  static async executeRaidAsync(raidId: string) {
    await prisma.raid.update({
      where: { id: raidId },
      data: { status: "searching", startedAt: new Date() },
    });

    // TODO: Implement real Apify search actors here
    // Each keyword and hashtag should become a RaidJob record
    // The RaidJob workers will then trigger investigation creation for discovered videos

    await prisma.raid.update({
      where: { id: raidId },
      data: { status: "completed", completedAt: new Date() },
    });

    console.log(`[RaidEngine] Raid ${raidId} completed.`);
  }
}
