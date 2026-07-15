/**
 * AI-generated investigation report.
 * Maps to the `ai_reports` table.
 *
 * One Incident → One AiReport
 */
export interface AiReport {
  id: string;
  incidentId: string;
  summary: string;
  riskScore: number; // 0-100
  confidence: number; // 0-100
  detectedSchool: string | null;
  bullyingCategory: string | null;
  sentiment: "Positive" | "Neutral" | "Negative" | "Highly Negative";
  recommendation: string;
  createdAt: string;
}

export interface AiReportRow {
  id: string;
  incident_id: string;
  summary: string;
  risk_score: number;
  confidence: number;
  detected_school: string | null;
  bullying_category: string | null;
  sentiment: "Positive" | "Neutral" | "Negative" | "Highly Negative";
  recommendation: string;
  created_at: string;
}
