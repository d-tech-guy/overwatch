import type { PROCESSING_STATUS, INVESTIGATION_STATUS, INCIDENT_PRIORITY, EVIDENCE_TYPE, RESOLUTION_OUTCOME } from "@/lib/constants";

export type ProcessingStatus = (typeof PROCESSING_STATUS)[keyof typeof PROCESSING_STATUS];
export type InvestigationStatus = (typeof INVESTIGATION_STATUS)[keyof typeof INVESTIGATION_STATUS];
export type IncidentPriority = (typeof INCIDENT_PRIORITY)[keyof typeof INCIDENT_PRIORITY];
export type EvidenceType = (typeof EVIDENCE_TYPE)[keyof typeof EVIDENCE_TYPE];
export type ResolutionOutcome = (typeof RESOLUTION_OUTCOME)[keyof typeof RESOLUTION_OUTCOME];

/**
 * Core incident entity — represents one submitted TikTok post.
 * Maps to the `incidents` table.
 */
export interface Incident {
  id: string;
  submittedBy: string | null;
  schoolId: string | null;
  tiktokUrl: string;
  processingStatus: ProcessingStatus;
  investigationStatus: InvestigationStatus;
  progress: number;
  publicToken: string;
  priority: IncidentPriority;
  createdAt: string;
  updatedAt: string;
}

/**
 * Database row shape (snake_case).
 */
export interface IncidentRow {
  id: string;
  submitted_by: string | null;
  school_id: string | null;
  tiktok_url: string;
  processing_status: ProcessingStatus;
  investigation_status: InvestigationStatus;
  progress: number;
  public_token: string;
  priority: IncidentPriority;
  created_at: string;
  updated_at: string;
}

/**
 * Evidence collected during an AI investigation.
 * Maps to the `evidence` table.
 */
export interface Evidence {
  id: string;
  incidentId: string;
  type: EvidenceType;
  content: string;
}

export interface EvidenceRow {
  id: string;
  incident_id: string;
  type: EvidenceType;
  content: string;
}

/**
 * Administrator note attached to an incident.
 * Maps to the `investigation_notes` table.
 */
export interface InvestigationNote {
  id: string;
  incidentId: string;
  authorId: string;
  note: string;
  createdAt: string;
}

export interface InvestigationNoteRow {
  id: string;
  incident_id: string;
  author_id: string;
  note: string;
  created_at: string;
}

/**
 * Final resolution of an investigation.
 * Maps to the `resolutions` table.
 */
export interface Resolution {
  id: string;
  incidentId: string;
  resolvedBy: string;
  outcome: ResolutionOutcome;
  remarks: string | null;
  resolvedAt: string;
}

export interface ResolutionRow {
  id: string;
  incident_id: string;
  resolved_by: string;
  outcome: ResolutionOutcome;
  remarks: string | null;
  resolved_at: string;
}

/**
 * Incident with related data — used for the investigation detail view.
 */
export interface IncidentWithRelations extends Incident {
  aiReport?: import("./report").AiReport;
  evidence?: Evidence[];
  notes?: InvestigationNote[];
  resolution?: Resolution;
}
