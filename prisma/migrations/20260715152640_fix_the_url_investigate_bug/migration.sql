-- CreateEnum
CREATE TYPE "processing_status" AS ENUM ('queued', 'fetching_metadata', 'metadata_complete', 'analyzing', 'report_generating', 'completed', 'failed_metadata', 'failed_ai');

-- CreateEnum
CREATE TYPE "investigation_status" AS ENUM ('pending_review', 'under_review', 'resolved', 'archived');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "evidence_type" AS ENUM ('caption', 'hashtag', 'comment', 'metadata', 'ai_evidence');

-- CreateTable
CREATE TABLE "schools" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "short_name" TEXT,
    "aliases" TEXT[],
    "state" TEXT,
    "country" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "school_id" UUID,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "public_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,
    "submitted_url" TEXT NOT NULL,
    "submitted_by" UUID,
    "submission_ip_hash" TEXT,
    "processing_status" "processing_status" NOT NULL DEFAULT 'queued',
    "investigation_status" "investigation_status" NOT NULL DEFAULT 'pending_review',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "author_username" TEXT,
    "caption" TEXT,
    "upload_timestamp" TIMESTAMPTZ,
    "hashtags" TEXT[],
    "comment_count" INTEGER,
    "like_count" INTEGER,
    "share_count" INTEGER,
    "detected_school_id" UUID,
    "detected_location" TEXT,
    "sentiment" TEXT,
    "severity" "severity",
    "risk_score" INTEGER,
    "confidence_score" INTEGER,
    "summary" TEXT,
    "explanation" TEXT,
    "ai_response_json" JSONB,

    CONSTRAINT "investigations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investigation_events" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investigation_id" UUID NOT NULL,
    "event" TEXT NOT NULL,
    "description" TEXT,
    "progress" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investigation_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investigation_id" UUID NOT NULL,
    "type" "evidence_type" NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investigation_id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "investigations_public_id_key" ON "investigations"("public_id");

-- CreateIndex
CREATE INDEX "idx_investigations_processing_status" ON "investigations"("processing_status");

-- CreateIndex
CREATE INDEX "idx_investigations_investigation_status" ON "investigations"("investigation_status");

-- CreateIndex
CREATE INDEX "idx_investigations_detected_school_id" ON "investigations"("detected_school_id");

-- CreateIndex
CREATE INDEX "idx_investigations_created_at" ON "investigations"("created_at");

-- CreateIndex
CREATE INDEX "idx_investigations_public_id" ON "investigations"("public_id");

-- CreateIndex
CREATE INDEX "idx_investigation_events_investigation_id" ON "investigation_events"("investigation_id");

-- CreateIndex
CREATE INDEX "idx_evidence_investigation_id" ON "evidence"("investigation_id");

-- CreateIndex
CREATE INDEX "idx_admin_notes_investigation_id" ON "admin_notes"("investigation_id");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigations" ADD CONSTRAINT "investigations_detected_school_id_fkey" FOREIGN KEY ("detected_school_id") REFERENCES "schools"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investigation_events" ADD CONSTRAINT "investigation_events_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_investigation_id_fkey" FOREIGN KEY ("investigation_id") REFERENCES "investigations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_notes" ADD CONSTRAINT "admin_notes_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
