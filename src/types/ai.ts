import type { AiReport } from "./report";
import type { Evidence } from "./incident";

/**
 * Input to the AI investigation pipeline.
 * Contains all publicly available TikTok content.
 */
export interface InvestigationInput {
  tiktokUrl: string;
  caption?: string;
  hashtags?: string[];
  comments?: string[];
  transcript?: string;
  ocrText?: string;
  creatorUsername?: string;
  uploadedAt?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}

/**
 * Output from Stage 1 — School Detection.
 */
export interface SchoolDetectionResult {
  detectedSchool: string | null;
  confidence: number;
  matchedTerms: string[];
  reasoning: string;
}

/**
 * Output from Stage 2 — Harm Detection.
 */
export interface HarmDetectionResult {
  isHarmful: boolean;
  categories: string[];
  supportingEvidence: string[];
  reasoning: string;
}

/**
 * Output from Stage 3 — Context Analysis.
 */
export interface ContextAnalysisResult {
  sentiment: AiReport["sentiment"];
  intent: "Positive" | "Neutral" | "Ambiguous" | "Negative";
  contextSummary: string;
}

/**
 * Output from Stage 4 — Severity Assessment.
 */
export interface SeverityAssessmentResult {
  riskScore: number; // 0-100
  priority: "Low" | "Medium" | "High" | "Critical";
  factors: string[];
}

/**
 * Full structured AI investigation report — output from Stage 5.
 * This is persisted to `ai_reports` and `evidence` tables.
 */
export interface InvestigationReport {
  summary: string;
  riskScore: number;
  confidence: number;
  detectedSchool: string | null;
  bullyingCategory: string | null;
  sentiment: AiReport["sentiment"];
  recommendation: string;
  evidence: Omit<Evidence, "id" | "incidentId">[];
  schoolDetection: SchoolDetectionResult;
  harmDetection: HarmDetectionResult;
  contextAnalysis: ContextAnalysisResult;
  severityAssessment: SeverityAssessmentResult;
}

/**
 * Result returned from the AI service layer to the server action.
 */
export type InvestigationResult =
  | { success: true; report: InvestigationReport }
  | { success: false; error: string };
