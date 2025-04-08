-- CreateEnum
CREATE TYPE "BouncedBy" AS ENUM ('email_check', 'sending_webhook');

-- CreateEnum
CREATE TYPE "EmailCheckStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "EmailCheckResult" AS ENUM ('ok', 'email_invalid', 'risky', 'unknown', 'accept_all');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "bounced_at" TIMESTAMP(3),
ADD COLUMN     "bounced_by" "BouncedBy";

-- CreateTable
CREATE TABLE "BulkEmailCheck" (
    "id" TEXT NOT NULL,
    "contact_group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BulkEmailCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_checks" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "EmailCheckStatus" NOT NULL DEFAULT 'pending',
    "result" "EmailCheckResult" NOT NULL DEFAULT 'unknown',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "email_checks_pkey" PRIMARY KEY ("id")
);
