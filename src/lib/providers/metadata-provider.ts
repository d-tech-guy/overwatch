/**
 * Metadata Provider
 *
 * The sole abstraction layer between the investigation pipeline and
 * any external metadata source.
 *
 * The investigation service MUST only call this provider.
 * It must never call Apify scrapers directly.
 *
 * Swapping the underlying data source (e.g. a different Apify Actor
 * or a future in-house scraper) requires only changing the functions
 * below — no changes to investigation-service.ts or any other module.
 */

import { fetchVideoMetadata } from "@/lib/apify/video";
import { fetchProfile } from "@/lib/apify/profile";
import { fetchComments } from "@/lib/apify/comments";
import type {
  ApifyVideoMetadata,
  ApifyProfileMetadata,
  ApifyCommentMetadata,
} from "@/types/apify";

export interface MetadataProvider {
  getVideoMetadata(url: string): Promise<ApifyVideoMetadata>;
  getProfile(username: string): Promise<ApifyProfileMetadata>;
  getComments(videoUrl: string, limit?: number): Promise<ApifyCommentMetadata[]>;
}

/**
 * The production implementation backed by Apify.
 */
export const ApifyMetadataProvider: MetadataProvider = {
  getVideoMetadata(url: string) {
    return fetchVideoMetadata(url);
  },

  getProfile(username: string) {
    return fetchProfile(username);
  },

  getComments(videoUrl: string, limit?: number) {
    return fetchComments(videoUrl, limit);
  },
};
