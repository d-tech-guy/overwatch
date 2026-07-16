/**
 * AI Prompt Templates
 *
 * Contains the single investigation prompt that sends the entire
 * evidence package to Gemini in one structured request.
 *
 * Keeping prompts here (not inside function bodies) makes them
 * easy to review, test, and update independently of the pipeline.
 */

import type { ApifyVideoMetadata, ApifyProfileMetadata, ApifyCommentMetadata } from "@/types/apify";

export interface InvestigationPromptInput {
  videoUrl: string;
  video: ApifyVideoMetadata | null;
  profile: ApifyProfileMetadata | null;
  comments: ApifyCommentMetadata[];
  transcript?: string | null;
  ocrText?: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatVideoSection(video: ApifyVideoMetadata | null, videoUrl: string): string {
  if (!video) return `Video URL: ${videoUrl}\n(Metadata unavailable)`;
  return [
    `Video URL: ${videoUrl}`,
    video.caption ? `Caption: ${video.caption}` : null,
    video.authorUsername ? `Author: @${video.authorUsername}` : null,
    video.authorDisplayName ? `Display Name: ${video.authorDisplayName}` : null,
    video.uploadDate ? `Upload Date: ${video.uploadDate}` : null,
    video.duration ? `Duration: ${video.duration}s` : null,
    video.views !== null ? `Views: ${video.views.toLocaleString()}` : null,
    video.likes !== null ? `Likes: ${video.likes.toLocaleString()}` : null,
    video.comments !== null ? `Comment Count: ${video.comments.toLocaleString()}` : null,
    video.shares !== null ? `Shares: ${video.shares.toLocaleString()}` : null,
    video.bookmarks !== null ? `Bookmarks: ${video.bookmarks.toLocaleString()}` : null,
    video.hashtags.length ? `Hashtags: ${video.hashtags.map((h) => `#${h}`).join(" ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatProfileSection(profile: ApifyProfileMetadata | null): string {
  if (!profile) return "(Creator profile unavailable)";
  return [
    profile.username ? `Username: @${profile.username}` : null,
    profile.displayName ? `Display Name: ${profile.displayName}` : null,
    profile.bio ? `Bio: ${profile.bio}` : null,
    profile.followers !== null ? `Followers: ${profile.followers.toLocaleString()}` : null,
    profile.following !== null ? `Following: ${profile.following.toLocaleString()}` : null,
    profile.totalLikes !== null ? `Total Likes: ${profile.totalLikes.toLocaleString()}` : null,
    `Verified: ${profile.verified ? "Yes" : "No"}`,
    profile.region ? `Region: ${profile.region}` : null,
    profile.language ? `Language: ${profile.language}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function formatCommentsSection(comments: ApifyCommentMetadata[]): string {
  if (!comments.length) return "(No comments available)";
  return comments
    .slice(0, 100)
    .map((c, i) => {
      const prefix = c.pinned ? "[PINNED] " : "";
      const author = c.author ? `@${c.author}` : "Unknown";
      return `  ${i + 1}. ${prefix}${author}: ${c.text ?? "(empty)"}`;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Main investigation prompt
// ---------------------------------------------------------------------------

export function buildInvestigationPrompt(input: InvestigationPromptInput): string {
  return `You are a Senior Cyberbullying Investigator at OverWatch, an AI-powered cyber-forensics platform used by secondary schools.

Your role is NOT to summarise TikTok content. Your role is to perform a structured forensic investigation of potentially harmful content targeting schools or students.

You must be objective, evidence-based, and precise. Your output will be reviewed by school administrators making disciplinary decisions.

---

## EVIDENCE PACKAGE

### Video Metadata
${formatVideoSection(input.video, input.videoUrl)}

### Creator Profile
${formatProfileSection(input.profile)}

### Comments (${input.comments.length} collected)
${formatCommentsSection(input.comments)}

${input.transcript ? `### Audio Transcript\n${input.transcript}\n` : ""}
${input.ocrText ? `### On-Screen Text (OCR)\n${input.ocrText}\n` : ""}

---

## INVESTIGATION QUESTIONS

You must answer every question below. Do not skip any.

1. Is another school or educational institution targeted? If yes, name it.
2. Are multiple schools mentioned? If yes, list them all.
3. Are any students, teachers, or staff members identifiable? If yes, who?
4. Is there evidence of school rivalry or inter-school conflict?
5. Is cyberbullying present?
6. Is there harassment?
7. Is there threatening language?
8. Is there incitement to violence or retaliation?
9. Is there hate speech?
10. Is there defamation or false claims?
11. Could this content damage a school's reputation?
12. What is the emotional tone? (hostile / aggressive / mocking / neutral / positive)
13. How severe is this incident? (Score 0-100. 0-24 = low, 25-49 = medium, 50-74 = high, 75-100 = critical)
14. How confident are you in your findings? (0-100)
15. Should administrators review this immediately?
16. What is your recommended administrative action?
17. Write a professional executive summary (2-4 sentences) suitable for a school administrator.
18. Write a detailed explanation of how you reached your conclusion, referencing specific evidence.
19. List every piece of evidence that supports your findings (direct quotes, usernames, hashtags, etc).

---

## OUTPUT FORMAT

Return ONLY valid JSON. No markdown. No commentary. No explanation outside the JSON.

{
  "severity": "low" | "medium" | "high" | "critical",
  "severityScore": <0-100>,
  "confidence": <0-100>,
  "targetSchool": "<primary targeted school name or null>",
  "mentionedSchools": ["<school1>", "<school2>"],
  "detectedStudents": ["<name or username>"],
  "location": "<detected city or region or null>",
  "sentiment": "hostile" | "aggressive" | "mocking" | "neutral" | "positive",
  "containsBullying": <true|false>,
  "containsThreat": <true|false>,
  "containsHarassment": <true|false>,
  "containsIncitement": <true|false>,
  "containsHateSpeech": <true|false>,
  "containsDefamation": <true|false>,
  "reputationDamage": <true|false>,
  "requiresImmediateReview": <true|false>,
  "summary": "<professional executive summary>",
  "explanation": "<detailed multi-paragraph analysis>",
  "recommendation": "<specific recommended administrative action>",
  "evidence": ["<evidence item 1>", "<evidence item 2>", "<evidence item 3>"]
}

The JSON must be parseable. Do not include trailing commas or comments.`;
}
