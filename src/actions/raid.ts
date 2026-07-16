"use server";

import { RaidService } from "@/lib/raid/raid-service";

export async function initiateRaidAction(formData: FormData) {
  const institution = formData.get("institution") as string;
  const keywords = formData.get("keywords") as string;
  const hashtags = formData.get("hashtags") as string;
  const creators = formData.get("creators") as string;

  const parseList = (str?: string) => str ? str.split(",").map(i => i.trim()).filter(Boolean) : [];

  try {
    const raid = await RaidService.initiateRaid({
      keywords: parseList(keywords),
      hashtags: parseList(hashtags),
      creators: parseList(creators),
    });

    return { success: true, raidId: raid.id };
  } catch (error: any) {
    console.error("[RaidAction] Failed to initialize raid:", error);
    return { error: error.message || "Failed to initiate raid." };
  }
}
