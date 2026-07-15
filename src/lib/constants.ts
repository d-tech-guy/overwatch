/**
 * Application-wide constants.
 *
 * Centralises magic strings and shared configuration values.
 * Import from here rather than hardcoding values throughout the codebase.
 */

// Application
export const APP_NAME = "OverWatch" as const;
export const APP_DESCRIPTION =
  "AI-powered cyberbullying investigation platform for secondary schools." as const;

// Routes
export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
  },
  dashboard: {
    root: "/dashboard",
    incidents: "/dashboard/incidents",
    investigations: "/dashboard/investigations",
    intelligence: "/dashboard/intelligence",
    schools: "/dashboard/schools",
    settings: "/dashboard/settings",
  },
} as const;

// Protected route prefixes — matched by middleware
export const PROTECTED_ROUTES = ["/dashboard"] as const;

// Processing statuses (system-managed)
export const PROCESSING_STATUS = {
  queued: "queued",
  fetchingMetadata: "fetching_metadata",
  metadataComplete: "metadata_complete",
  analyzing: "analyzing",
  reportGenerating: "report_generating",
  completed: "completed",
  failedMetadata: "failed_metadata",
  failedAi: "failed_ai",
} as const;

// Investigation statuses (administrator-managed)
export const INVESTIGATION_STATUS = {
  pendingReview: "pending_review",
  underReview: "under_review",
  resolved: "resolved",
  archived: "archived",
} as const;

// Incident priorities
export const INCIDENT_PRIORITY = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
} as const;

// Resolution outcomes
export const RESOLUTION_OUTCOME = {
  confirmedBullying: "Confirmed Bullying",
  falsePositive: "False Positive",
  insufficientEvidence: "Insufficient Evidence",
  escalated: "Escalated",
  closed: "Closed",
} as const;

// Evidence types
export const EVIDENCE_TYPE = {
  caption: "Caption",
  transcript: "Transcript",
  ocr: "OCR",
  comment: "Comment",
  hashtag: "Hashtag",
  metadata: "Metadata",
} as const;

// User roles
export const USER_ROLE = {
  superAdmin: "super_admin",
  schoolAdmin: "school_admin",
} as const;

// AI risk score thresholds
export const RISK_THRESHOLD = {
  low: 25,
  medium: 50,
  high: 75,
  critical: 90,
} as const;

// TikTok URL pattern
export const TIKTOK_URL_PATTERN =
  /^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\/.+/i;
