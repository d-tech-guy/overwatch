/**
 * Apify Profile Scraper
 *
 * Fetches TikTok creator profile using the Actor configured in
 * APIFY_PROFILE_ACTOR. Maps the raw Actor response into the
 * standardized ApifyProfileMetadata shape.
 */

import { env } from "@/lib/env";
import { getApifyClient } from "./client";
import type { ApifyProfileMetadata } from "@/types/apify";

/** Raw field shape returned by clockworks/tiktok-profile-scraper */
interface RawProfileItem {
  user?: {
    uniqueId?: string;
    nickname?: string;
    signature?: string;
    verified?: boolean;
    avatarLarger?: string;
    region?: string;
    language?: string;
  };
  userInfo?: {
    user?: {
      uniqueId?: string;
      nickname?: string;
      signature?: string;
      verified?: boolean;
      avatarLarger?: string;
      region?: string;
      language?: string;
    };
    stats?: {
      followerCount?: number;
      followingCount?: number;
      heartCount?: number;
    };
  };
  stats?: {
    followerCount?: number;
    followingCount?: number;
    heartCount?: number;
  };
  // flat alternatives used by some Actor versions
  uniqueId?: string;
  nickname?: string;
  signature?: string;
  verified?: boolean;
  avatarLarger?: string;
  region?: string;
  language?: string;
  followerCount?: number;
  followingCount?: number;
  heartCount?: number;
}

function mapProfileItem(raw: RawProfileItem): ApifyProfileMetadata {
  // Support both nested and flat response shapes
  const user = raw.userInfo?.user ?? raw.user ?? raw;
  const stats = raw.userInfo?.stats ?? raw.stats ?? raw;

  return {
    username: (user as RawProfileItem).uniqueId ?? null,
    displayName: (user as RawProfileItem).nickname ?? null,
    bio: (user as RawProfileItem).signature ?? null,
    followers: (stats as RawProfileItem).followerCount ?? null,
    following: (stats as RawProfileItem).followingCount ?? null,
    totalLikes: (stats as RawProfileItem).heartCount ?? null,
    verified: Boolean((user as RawProfileItem).verified),
    avatar: (user as RawProfileItem).avatarLarger ?? null,
    region: (user as RawProfileItem).region ?? null,
    language: (user as RawProfileItem).language ?? null,
  };
}

export async function fetchProfile(username: string): Promise<ApifyProfileMetadata> {
  const client = getApifyClient();

  const run = await client.actor(env.apifyProfileActor).call({
    profiles: [username],
    maxItems: 1,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  if (!items || items.length === 0) {
    throw new Error(`Profile scraper returned an empty dataset for username: ${username}`);
  }

  return mapProfileItem(items[0] as RawProfileItem);
}
