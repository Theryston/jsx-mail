/*
  Warnings:

  - Added the required column `global_bulk_email_check_max_batch_size` to the `default_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "default_settings" ADD COLUMN     "global_bulk_email_check_max_batch_size" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "bulk_email_check_batches" (
    "id" TEXT NOT NULL,
    "bulk_email_check_id" TEXT NOT NULL,
    "status" "BulkEmailCheckStatus" NOT NULL DEFAULT 'pending',
    "total_emails" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_email_check_batches_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bulk_email_check_batches" ADD CONSTRAINT "bulk_email_check_batches_bulk_email_check_id_fkey" FOREIGN KEY ("bulk_email_check_id") REFERENCES "bulk_email_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
