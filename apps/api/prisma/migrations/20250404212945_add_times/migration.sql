-- AlterTable
ALTER TABLE "bulk_email_checks" ADD COLUMN     "estimated_end_at" TIMESTAMP(3),
ADD COLUMN     "estimated_end_seconds" INTEGER,
ADD COLUMN     "started_at" TIMESTAMP(3);
