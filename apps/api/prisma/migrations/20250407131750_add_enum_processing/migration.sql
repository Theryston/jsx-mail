/*
  Warnings:

  - The `status` column on the `bulk_email_check_batches` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BulkEmailCheckBatchStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "bulk_email_check_batches" DROP COLUMN "status",
ADD COLUMN     "status" "BulkEmailCheckBatchStatus" NOT NULL DEFAULT 'pending';
