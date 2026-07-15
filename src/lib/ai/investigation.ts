/**
 * AI Investigation Pipeline
 *
 * Executes the 5-stage investigation process for a submitted TikTok URL.
 *
 * Stage 1 — School Detection
 * Stage 2 — Harm Detection
 * Stage 3 — Context Analysis
 * Stage 4 — Severity Assessment
 * Stage 5 — Report Generation
 *
 * Never call this from UI components.
 * Always call from Server Actions or Route Handlers.
 */

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import type {
  InvestigationInput,
  InvestigationReport,
  InvestigationResult,
  SchoolDetectionResult,
  HarmDetectionResult,
  ContextAnalysisResult,
  SeverityAssessmentResult,
} from "@/types/ai";
import {
  buildSchoolDetectionPrompt,
  buildHarmDetectionPrompt,
  buildContextAnalysisPrompt,
  buildSeverityAssessmentPrompt,
  buildReportGenerationPrompt,
} from "./prompts";

// ---------------------------------------------------------------------------
// Model configuration
// ---------------------------------------------------------------------------

const model = google("gemini-2.0-flash");

// ---------------------------------------------------------------------------
// Zod schemas for AI response validation
// ---------------------------------------------------------------------------

const schoolDetectionSchema = z.object({
  detectedSchool: z.string().nullable(),
  confidence: z.number().min(0).max(100),
  matchedTerms: z.array(z.string()),
  reasoning: z.string(),
});

const harmDetectionSchema = z.object({
  isHarmful: z.boolean(),
  categories: z.array(z.string()),
  supportingEvidence: z.array(z.string()),
  reasoning: z.string(),
});

const contextAnalysisSchema = z.object({
  sentiment: z.enum(["Positive", "Neutral", "Negative", "Highly Negative"]),
  intent: z.enum(["Positive", "Neutral", "Ambiguous", "Negative"]),
  contextSummary: z.string(),
});

const severityAssessmentSchema = z.object({
  riskScore: z.number().min(0).max(100),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  factors: z.array(z.string()),
});

const reportGenerationSchema = z.object({
  summary: z.string(),
  recommendation: z.string(),
});

// ---------------------------------------------------------------------------
// Stage runners
// ---------------------------------------------------------------------------

async function runSchoolDetection(
  input: InvestigationInput,
  registeredSchools: { name: string; shortName: string; aliases: string[] }[]
): Promise<SchoolDetectionResult> {
  const prompt = buildSchoolDetectionPrompt(input, registeredSchools);

  const { object } = await generateObject({
    model,
    schema: schoolDetectionSchema,
    prompt,
  });

  return object;
}

async function runHarmDetection(
  input: InvestigationInput
): Promise<HarmDetectionResult> {
  const prompt = buildHarmDetectionPrompt(input);

  const { object } = await generateObject({
    model,
    schema: harmDetectionSchema,
    prompt,
  });

  return object;
}

async function runContextAnalysis(
  input: InvestigationInput
): Promise<ContextAnalysisResult> {
  const prompt = buildContextAnalysisPrompt(input);

  const { object } = await generateObject({
    model,
    schema: contextAnalysisSchema,
    prompt,
  });

  return object;
}

async function runSeverityAssessment(
  input: InvestigationInput,
  harmResult: HarmDetectionResult,
  contextResult: ContextAnalysisResult
): Promise<SeverityAssessmentResult> {
  const prompt = buildSeverityAssessmentPrompt(input, harmResult, contextResult);

  const { object } = await generateObject({
    model,
    schema: severityAssessmentSchema,
    prompt,
  });

  return object;
}

async function runReportGeneration(
  input: InvestigationInput,
  schoolResult: SchoolDetectionResult,
  harmResult: HarmDetectionResult,
  contextResult: ContextAnalysisResult,
  severityResult: SeverityAssessmentResult
): Promise<{ summary: string; recommendation: string }> {
  const prompt = buildReportGenerationPrompt(input, {
    school: schoolResult,
    harm: harmResult,
    context: contextResult,
    severity: severityResult,
  });

  const { object } = await generateObject({
    model,
    schema: reportGenerationSchema,
    prompt,
  });

  return object;
}

// ---------------------------------------------------------------------------
// Main pipeline entry point
// ---------------------------------------------------------------------------

export async function runInvestigation(
  input: InvestigationInput,
  registeredSchools: { name: string; shortName: string; aliases: string[] }[] = []
): Promise<InvestigationResult> {
  try {
    // Stage 1 — School Detection
    const schoolResult = await runSchoolDetection(input, registeredSchools);

    // Stage 2 — Harm Detection
    const harmResult = await runHarmDetection(input);

    // Stage 3 — Context Analysis
    const contextResult = await runContextAnalysis(input);

    // Stage 4 — Severity Assessment
    const severityResult = await runSeverityAssessment(
      input,
      harmResult,
      contextResult
    );

    // Stage 5 — Report Generation
    const reportResult = await runReportGeneration(
      input,
      schoolResult,
      harmResult,
      contextResult,
      severityResult
    );

    // Collect evidence items from harm detection
    const evidenceItems = harmResult.supportingEvidence.map((content) => ({
      type: "Caption" as const,
      content,
    }));

    const report: InvestigationReport = {
      summary: reportResult.summary,
      riskScore: severityResult.riskScore,
      confidence: schoolResult.confidence,
      detectedSchool: schoolResult.detectedSchool,
      bullyingCategory: harmResult.categories[0] ?? null,
      sentiment: contextResult.sentiment,
      recommendation: reportResult.recommendation,
      evidence: evidenceItems,
      schoolDetection: schoolResult,
      harmDetection: harmResult,
      contextAnalysis: contextResult,
      severityAssessment: severityResult,
    };

    return { success: true, report };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI error occurred.";

    console.error("[AI Investigation Pipeline] Error:", message);

    return {
      success: false,
      error: `Investigation failed: ${message}`,
    };
  }
}
