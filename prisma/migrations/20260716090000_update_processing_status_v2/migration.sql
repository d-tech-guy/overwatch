-- AlterEnum: Replace old processing_status values with v2 values
-- This must be done in multiple steps because PostgreSQL cannot drop enum values in use.

-- Step 1: Add all new enum values
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'validating_url';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'creating_investigation';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'fetching_video_metadata';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'video_metadata_complete';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'fetching_profile';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'profile_complete';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'fetching_comments';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'comments_complete';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'preparing_ai_context';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'calling_gemini';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'ai_analysis_complete';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'generating_report';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'saving_results';
ALTER TYPE "processing_status" ADD VALUE IF NOT EXISTS 'failed';
