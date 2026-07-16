/**
 * AI Investigation Pipeline
 *
 * Executes the investigation by submitting a full evidence package
 * to Gemini in a single request.
 *
 * Never call this from UI components.
 * Always call from investigation-service.ts.
 */

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { buildInvestigationPrompt } from "./prompts";
import type { InvestigationPromptInput } from "./prompts";

// ---------------------------------------------------------------------------
// Model configuration
// ---------------------------------------------------------------------------

const model = google("gemini-2.0-flash");

// ---------------------------------------------------------------------------
// Zod schema — mirrors the JSON output contract from the prompt
// ---------------------------------------------------------------------------

const investigationSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  severityScore: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  targetSchool: z.string().nullable(),
  mentionedSchools: z.array(z.string()),
  detectedStudents: z.array(z.string()),
  location: z.string().nullable(),
  sentiment: z.enum(["hostile", "aggressive", "mocking", "neutral", "positive"]),
  containsBullying: z.boolean(),
  containsThreat: z.boolean(),
  containsHarassment: z.boolean(),
  containsIncitement: z.boolean(),
  containsHateSpeech: z.boolean(),
  containsDefamation: z.boolean(),
  reputationDamage: z.boolean(),
  requiresImmediateReview: z.boolean(),
  summary: z.string(),
  explanation: z.string(),
  recommendation: z.string(),
  evidence: z.array(z.string()),
});

export type GeminiInvestigationResult = z.infer<typeof investigationSchema>;

// ---------------------------------------------------------------------------
// Pipeline entry point
// ---------------------------------------------------------------------------

export async function runInvestigation(
  input: InvestigationPromptInput
): Promise<GeminiInvestigationResult> {
  const prompt = buildInvestigationPrompt(input);

  const { object } = await generateObject({
    model,
    schema: investigationSchema,
    prompt,
  });

  return object;
}
