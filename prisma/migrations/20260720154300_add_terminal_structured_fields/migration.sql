-- AlterTable
ALTER TABLE "investigation_events" ADD COLUMN     "stage" TEXT,
ADD COLUMN     "severity" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "short_message" TEXT,
ADD COLUMN     "detailed_message" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "correlation_id" TEXT,
ADD COLUMN     "metadata_json" JSONB;
