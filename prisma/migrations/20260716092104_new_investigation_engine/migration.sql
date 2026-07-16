/*
  Warnings:

  - The values [fetching_metadata,metadata_complete,analyzing,report_generating,failed_metadata,failed_ai] on the enum `processing_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "processing_status_new" AS ENUM ('queued', 'validating_url', 'creating_investigation', 'fetching_video_metadata', 'video_metadata_complete', 'fetching_profile', 'profile_complete', 'fetching_comments', 'comments_complete', 'preparing_ai_context', 'calling_gemini', 'ai_analysis_complete', 'generating_report', 'saving_results', 'completed', 'failed');
ALTER TABLE "investigations" ALTER COLUMN "processing_status" DROP DEFAULT;
ALTER TABLE "investigations" ALTER COLUMN "processing_status" TYPE "processing_status_new" USING ("processing_status"::text::"processing_status_new");
ALTER TYPE "processing_status" RENAME TO "processing_status_old";
ALTER TYPE "processing_status_new" RENAME TO "processing_status";
DROP TYPE "processing_status_old";
ALTER TABLE "investigations" ALTER COLUMN "processing_status" SET DEFAULT 'queued';
COMMIT;
