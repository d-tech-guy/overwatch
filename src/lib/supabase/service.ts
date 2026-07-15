import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-only Supabase client that authenticates using the Service Role Key.
 *
 * NEVER import this in Client Components or expose to the browser.
 *
 * Use this exclusively for server-side background operations that run
 * outside of an HTTP request context (e.g. InvestigationService), where
 * the cookie-based server client is unavailable.
 *
 * The service role key bypasses Row Level Security — use with care.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Ensure these are set in your environment variables."
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      // Disable automatic session persistence — this is a server-only client.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
