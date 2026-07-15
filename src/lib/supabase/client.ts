import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Browser-side Supabase client.
 *
 * Use this in Client Components only.
 * For Server Components and Server Actions, use the server client.
 *
 * Uses @supabase/ssr to handle cookies correctly in Next.js App Router.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
