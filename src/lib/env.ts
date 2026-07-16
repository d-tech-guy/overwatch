/**
 * Environment variable validation.
 *
 * Validates all required environment variables at startup.
 * The application will throw on boot if any required variable is missing,
 * making misconfiguration failures fast and explicit.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}\n` +
        `Check your .env file and ensure it is populated correctly.`
    );
  }
  return value;
}

export const env = {
  // Application
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  // Supabase (public — safe to expose to the client)
  supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),

  // Supabase (server-only — never expose to the client)
  get supabaseServiceRoleKey() {
    return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  },

  // Google Gemini (server-only)
  get googleGenerativeAiApiKey() {
    return requireEnv("GOOGLE_GENERATIVE_AI_API_KEY");
  },

  // Apify (server-only)
  get apifyToken() {
    return requireEnv("APIFY_TOKEN");
  },
  get apifyVideoActor() {
    return requireEnv("APIFY_VIDEO_ACTOR");
  },
  get apifyProfileActor() {
    return requireEnv("APIFY_PROFILE_ACTOR");
  },
  get apifyCommentsActor() {
    return requireEnv("APIFY_COMMENTS_ACTOR");
  },

  nodeEnv: (process.env.NODE_ENV ?? "development") as
    | "development"
    | "production"
    | "test",

  get isDevelopment() {
    return this.nodeEnv === "development";
  },

  get isProduction() {
    return this.nodeEnv === "production";
  },
} as const;
