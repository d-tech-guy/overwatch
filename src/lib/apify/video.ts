/**
 * Apify Video Scraper
 *
 * Fetches TikTok video metadata using the Actor configured in
 * APIFY_VIDEO_ACTOR. Maps the raw Actor response into the
 * standardized ApifyVideoMetadata shape.
 *
 * No other module should depend on the raw Apify response format.
 */

import { env } from "@/lib/env";
import { getApifyClient } from "./client";
import type { ApifyVideoMetadata } from "@/types/apify";

/** Raw field shape returned by clockworks/tiktok-video-scraper */
interface RawVideoItem {
  id?: string;
  webVideoUrl?: string;
  videoUrl?: string;
  downloadUrl?: string;
  coverUrl?: string;
  thumbnailUrl?: string;
  text?: string;
  desc?: string;
  createTime?: number;
  createTimeISO?: string;
  authorMeta?: {
    name?: string;
    nickName?: string;
    id?: string;
  };
  hashtags?: Array<{ name?: string }>;
  videoMeta?: {
    duration?: number;
    width?: number;
    height?: number;
  };
  diggCount?: number;
  commentCount?: number;
  shareCount?: number;
  collectCount?: number;
  playCount?: number;
  // alternative field names used by some Actor versions
  stats?: {
    diggCount?: number;
    commentCount?: number;
    shareCount?: number;
    collectCount?: number;
    playCount?: number;
  };
}

function mapVideoItem(raw: RawVideoItem): ApifyVideoMetadata {
  const stats = raw.stats ?? {};
  const authorMeta = raw.authorMeta ?? {};

  return {
    authorUsername: authorMeta.name ?? null,
    authorDisplayName: authorMeta.nickName ?? null,
    caption: raw.text ?? raw.desc ?? null,
    uploadDate: raw.createTimeISO ?? (raw.createTime ? new Date(raw.createTime * 1000).toISOString() : null),
    hashtags: (raw.hashtags ?? []).map((h) => h.name ?? "").filter(Boolean),
    views: raw.playCount ?? stats.playCount ?? null,
    likes: raw.diggCount ?? stats.diggCount ?? null,
    comments: raw.commentCount ?? stats.commentCount ?? null,
    shares: raw.shareCount ?? stats.shareCount ?? null,
    bookmarks: raw.collectCount ?? stats.collectCount ?? null,
    duration: raw.videoMeta?.duration ?? null,
    thumbnailUrl: raw.coverUrl ?? raw.thumbnailUrl ?? null,
    downloadUrl: raw.downloadUrl ?? null,
    videoUrl: raw.webVideoUrl ?? raw.videoUrl ?? null,
  };
}

export async function fetchVideoMetadata(url: string): Promise<ApifyVideoMetadata> {
  const client = getApifyClient();

  const run = await client.actor(env.apifyVideoActor).call({
    startUrls: [{ url }],
    maxItems: 1,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items || items.length === 0) {
    throw new Error(`Video scraper returned an empty dataset for URL: ${url}`);
  }

  return mapVideoItem(items[0] as RawVideoItem);
}
