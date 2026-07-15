/**
 * Registered school.
 * Maps directly to the `schools` table in Supabase.
 *
 * Aliases allow the AI to recognise abbreviations, hashtags,
 * and common misspellings when scanning TikTok content.
 */
export interface School {
  id: string;
  name: string;
  shortName: string;
  aliases: string[];
  logoUrl: string | null;
  createdAt: string;
}

/**
 * Database row shape (snake_case).
 */
export interface SchoolRow {
  id: string;
  name: string;
  short_name: string;
  aliases: string[];
  logo_url: string | null;
  created_at: string;
}
