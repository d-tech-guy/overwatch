-- CreateEnum
CREATE TYPE "raid_status" AS ENUM ('queued', 'searching', 'collecting', 'processing', 'completed', 'cancelled', 'failed', 'timed_out');

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "institution_name" TEXT NOT NULL,
    "administrator_name" TEXT NOT NULL,
    "administrator_email" TEXT NOT NULL,
    "website" TEXT,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raids" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "institution_id" UUID,
    "status" "raid_status" NOT NULL DEFAULT 'queued',
    "keywords" TEXT[],
    "hashtags" TEXT[],
    "creators" TEXT[],
    "configuration" JSONB,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raid_jobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "raid_id" UUID NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "raid_status" NOT NULL DEFAULT 'queued',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "target_url" TEXT,
    "started_at" TIMESTAMPTZ(6),
    "completed_at" TIMESTAMPTZ(6),

    CONSTRAINT "raid_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creators" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "creator_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "display_name" TEXT,
    "profile_url" TEXT,
    "follower_count" INTEGER,
    "verification_status" BOOLEAN NOT NULL DEFAULT false,
    "risk_score" INTEGER,
    "first_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "creators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keywords" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "keyword" TEXT NOT NULL,
    "category" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "risk_association" INTEGER,
    "first_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hashtags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "hashtag" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "growth_rate" DOUBLE PRECISION,
    "threat_level" INTEGER,
    "first_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_raid_jobs_raid_id" ON "raid_jobs"("raid_id");

-- CreateIndex
CREATE UNIQUE INDEX "creators_creator_id_key" ON "creators"("creator_id");

-- CreateIndex
CREATE UNIQUE INDEX "keywords_keyword_key" ON "keywords"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "hashtags_hashtag_key" ON "hashtags"("hashtag");

-- AddForeignKey
ALTER TABLE "raid_jobs" ADD CONSTRAINT "raid_jobs_raid_id_fkey" FOREIGN KEY ("raid_id") REFERENCES "raids"("id") ON DELETE CASCADE ON UPDATE CASCADE;
