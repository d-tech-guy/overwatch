/**
 * Apify Comments Scraper
 *
 * Fetches TikTok comments using the Actor configured in
 * APIFY_COMMENTS_ACTOR. Maps the raw Actor response into the
 * standardized ApifyCommentMetadata shape.
 *
 * Limited to a configurable amount (default: 100 comments).
 */

import { env } from "@/lib/env";
import { getApifyClient } from "./client";
import type { ApifyCommentMetadata } from "@/types/apify";

const DEFAULT_COMMENT_LIMIT = 100;

/** Raw field shape returned by clockworks/tiktok-comments-scraper */
interface RawCommentItem {
  // Common field names
  text?: string;
  commentText?: string;
  authorUniqueId?: string;
  authorName?: string;
  author?: { uniqueId?: string; nickname?: string };
  user?: { uniqueId?: string; nickname?: string };
  diggCount?: number;
  replyCommentTotal?: number;
  replyCount?: number;
  isPinned?: boolean;
  pinned?: boolean;
  isTop?: number | boolean;
}

function mapCommentItem(raw: RawCommentItem): ApifyCommentMetadata {
  const authorId =
    raw.authorUniqueId ??
    raw.authorName ??
    raw.author?.uniqueId ??
    raw.author?.nickname ??
    raw.user?.uniqueId ??
    null;

  return {
    author: authorId,
    text: raw.text ?? raw.commentText ?? null,
    likes: raw.diggCount ?? null,
    replies: raw.replyCommentTotal ?? raw.replyCount ?? null,
    pinned: Boolean(raw.isPinned ?? raw.pinned ?? (raw.isTop === 1 || raw.isTop === true)),
  };
}

export async function fetchComments(
  videoUrl: string,
  limit: number = DEFAULT_COMMENT_LIMIT
): Promise<ApifyCommentMetadata[]> {
  const client = getApifyClient();

  const run = await client.actor(env.apifyCommentsActor).call({
    startUrls: [{ url: videoUrl }],
    maxItems: limit,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items || items.length === 0) {
    return [];
  }

  return items.map((item) => mapCommentItem(item as unknown as RawCommentItem));
}
