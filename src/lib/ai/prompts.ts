/**
 * AI Prompt Templates
 *
 * Centralises all prompts used by the investigation pipeline.
 * Keeping prompts here (not inside function bodies) makes them
 * easy to review, test, and update independently of the pipeline logic.
 */

import type { InvestigationInput } from "@/types/ai";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatContentSection(input: InvestigationInput): string {
  const lines: string[] = [];

  if (input.caption) lines.push(`Caption: ${input.caption}`);
  if (input.hashtags?.length)
    lines.push(`Hashtags: ${input.hashtags.join(", ")}`);
  if (input.transcript) lines.push(`Audio Transcript: ${input.transcript}`);
  if (input.ocrText) lines.push(`On-Screen Text (OCR): ${input.ocrText}`);
  if (input.creatorUsername)
    lines.push(`Creator: @${input.creatorUsername}`);
  if (input.comments?.length) {
    lines.push(`Comments (${input.comments.length} total):`);
    input.comments.slice(0, 10).forEach((c) => lines.push(`  - ${c}`));
  }
  if (input.uploadedAt) lines.push(`Uploaded: ${input.uploadedAt}`);
  if (input.viewCount !== undefined)
    lines.push(`Views: ${input.viewCount.toLocaleString()}`);
  if (input.likeCount !== undefined)
    lines.push(`Likes: ${input.likeCount.toLocaleString()}`);

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// School Detection — Stage 1
// ---------------------------------------------------------------------------

export function buildSchoolDetectionPrompt(
  input: InvestigationInput,
  registeredSchools: { name: string; shortName: string; aliases: string[] }[]
): string {
  const schoolList = registeredSchools
    .map(
      (s) =>
        `- ${s.name} (short: ${s.shortName}, aliases: ${s.aliases.join(", ")})`
    )
    .join("\n");

  return `You are an expert cyberbullying investigator. Your task is Stage 1 of 5: School Detection.

Registered Schools:
${schoolList}

TikTok Content:
${formatContentSection(input)}

Your task:
Determine whether any registered school is referenced in this TikTok content.
Schools may be referenced by their full name, abbreviations, nicknames, hashtags, or common misspellings.

Respond ONLY with a valid JSON object in this exact format:
{
  "detectedSchool": "<school name or null>",
  "confidence": <0-100>,
  "matchedTerms": ["<term1>", "<term2>"],
  "reasoning": "<brief explanation>"
}`;
}

// ---------------------------------------------------------------------------
// Harm Detection — Stage 2
// ---------------------------------------------------------------------------

export function buildHarmDetectionPrompt(input: InvestigationInput): string {
  return `You are an expert cyberbullying investigator. Your task is Stage 2 of 5: Harm Detection.

TikTok Content:
${formatContentSection(input)}

Your task:
Determine whether this content contains any of the following harmful behaviours:
- Cyberbullying
- Harassment
- Threats
- Defamation
- Hate speech
- Mockery
- Public humiliation

Respond ONLY with a valid JSON object in this exact format:
{
  "isHarmful": <true|false>,
  "categories": ["<category1>", "<category2>"],
  "supportingEvidence": ["<quote or observation1>", "<quote or observation2>"],
  "reasoning": "<brief explanation>"
}`;
}

// ---------------------------------------------------------------------------
// Context Analysis — Stage 3
// ---------------------------------------------------------------------------

export function buildContextAnalysisPrompt(input: InvestigationInput): string {
  return `You are an expert cyberbullying investigator. Your task is Stage 3 of 5: Context Analysis.

TikTok Content:
${formatContentSection(input)}

Your task:
Analyse the intent and context of this content. Consider whether the tone is celebratory, critical, threatening, or neutral.
This step reduces false positives by looking beyond keywords to understand meaning.

Respond ONLY with a valid JSON object in this exact format:
{
  "sentiment": "<Positive|Neutral|Negative|Highly Negative>",
  "intent": "<Positive|Neutral|Ambiguous|Negative>",
  "contextSummary": "<1-2 sentence explanation of the content's context>"
}`;
}

// ---------------------------------------------------------------------------
// Severity Assessment — Stage 4
// ---------------------------------------------------------------------------

export function buildSeverityAssessmentPrompt(
  input: InvestigationInput,
  harmResult: { isHarmful: boolean; categories: string[] },
  contextResult: { sentiment: string }
): string {
  return `You are an expert cyberbullying investigator. Your task is Stage 4 of 5: Severity Assessment.

TikTok Content:
${formatContentSection(input)}

Harm Detection Result:
- Harmful: ${harmResult.isHarmful}
- Categories: ${harmResult.categories.join(", ") || "None"}

Context Analysis Result:
- Sentiment: ${contextResult.sentiment}

Your task:
Evaluate how severe this incident is on a scale of 0-100 (Risk Score).
Consider: direct targeting, language severity, threats, audience size, repeat insults.

Risk Score Guide:
- 0-24: Low — Unlikely to cause harm
- 25-49: Medium — Potentially harmful, monitor
- 50-74: High — Significant risk, investigate
- 75-100: Critical — Immediate attention required

Respond ONLY with a valid JSON object in this exact format:
{
  "riskScore": <0-100>,
  "priority": "<Low|Medium|High|Critical>",
  "factors": ["<factor1>", "<factor2>"]
}`;
}

// ---------------------------------------------------------------------------
// Report Generation — Stage 5
// ---------------------------------------------------------------------------

export function buildReportGenerationPrompt(
  input: InvestigationInput,
  stages: {
    school: { detectedSchool: string | null; confidence: number };
    harm: { isHarmful: boolean; categories: string[] };
    context: { sentiment: string; contextSummary: string };
    severity: { riskScore: number; priority: string };
  }
): string {
  return `You are an expert cyberbullying investigator. Your task is Stage 5 of 5: Investigation Report Generation.

TikTok Content:
${formatContentSection(input)}

Investigation Summary:
- Detected School: ${stages.school.detectedSchool ?? "None"}
- School Confidence: ${stages.school.confidence}%
- Harmful: ${stages.harm.isHarmful}
- Harm Categories: ${stages.harm.categories.join(", ") || "None"}
- Sentiment: ${stages.context.sentiment}
- Context: ${stages.context.contextSummary}
- Risk Score: ${stages.severity.riskScore}/100
- Priority: ${stages.severity.priority}

Your task:
Write a concise, professional investigation summary and provide a clear recommended next step for the school administrator.
The summary must explain WHY this content was flagged, not just what was detected.
The recommendation must be actionable.

Respond ONLY with a valid JSON object in this exact format:
{
  "summary": "<professional investigation summary, 2-4 sentences>",
  "recommendation": "<specific recommended action for the administrator>"
}`;
}
