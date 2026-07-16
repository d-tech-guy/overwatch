/**
 * Apify Client
 *
 * Singleton Apify client instance.
 * All Apify interactions must go through this module.
 * Never instantiate ApifyClient directly elsewhere.
 */

import { ApifyClient } from "apify-client";
import { env } from "@/lib/env";

let _client: ApifyClient | null = null;

export function getApifyClient(): ApifyClient {
  if (!_client) {
    _client = new ApifyClient({ token: env.apifyToken });
  }
  return _client;
}
