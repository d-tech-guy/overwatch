import { z } from "zod";
import { TIKTOK_URL_PATTERN } from "@/lib/constants";

/**
 * Shared Zod validation schemas.
 *
 * Centralised here so that server actions and API routes
 * always validate against the same rules.
 */

// TikTok URL — validates format and rejects clearly invalid values
export const tiktokUrlSchema = z
  .string()
  .min(1, "A TikTok URL is required.")
  .url("Please enter a valid URL.")
  .regex(
    TIKTOK_URL_PATTERN,
    "The URL must point to a TikTok post (tiktok.com)."
  );

// Incident submission (public reporting form)
export const incidentSubmissionSchema = z.object({
  tiktokUrl: tiktokUrlSchema,
  submittedBy: z.string().optional(), // Optional contact identifier
});

// Investigation note
export const investigationNoteSchema = z.object({
  note: z
    .string()
    .min(10, "Note must be at least 10 characters.")
    .max(2000, "Note cannot exceed 2000 characters."),
});

// Resolution
export const resolutionSchema = z.object({
  outcome: z.enum([
    "Confirmed Bullying",
    "False Positive",
    "Insufficient Evidence",
    "Escalated",
    "Closed",
  ]),
  remarks: z.string().max(2000, "Remarks cannot exceed 2000 characters.").optional(),
});

// Admin login
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// School
export const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters.").max(200),
  shortName: z.string().min(2).max(20),
  aliases: z.array(z.string()).optional(),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

// Type exports
export type IncidentSubmission = z.infer<typeof incidentSubmissionSchema>;
export type InvestigationNote = z.infer<typeof investigationNoteSchema>;
export type Resolution = z.infer<typeof resolutionSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type SchoolInput = z.infer<typeof schoolSchema>;
