/**
 * AI Service Layer — Entry Point
 *
 * Exports all public AI service functions.
 *
 * Never import AI providers directly from UI components.
 * Always go through this service layer.
 */

export { runInvestigation } from "./investigation";

export type {
  InvestigationInput,
  InvestigationReport,
  InvestigationResult,
} from "@/types/ai";
