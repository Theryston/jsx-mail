/*
  Warnings:

  - The values [processing] on the enum `BulkEmailCheckBatchStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BulkEmailCheckBatchStatus_new" AS ENUM ('pending', 'waiting_to_import', 'completed', 'failed');
ALTER TABLE "bulk_email_check_batches" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bulk_email_check_batches" ALTER COLUMN "status" TYPE "BulkEmailCheckBatchStatus_new" USING ("status"::text::"BulkEmailCheckBatchStatus_new");
ALTER TYPE "BulkEmailCheckBatchStatus" RENAME TO "BulkEmailCheckBatchStatus_old";
ALTER TYPE "BulkEmailCheckBatchStatus_new" RENAME TO "BulkEmailCheckBatchStatus";
DROP TYPE "BulkEmailCheckBatchStatus_old";
ALTER TABLE "bulk_email_check_batches" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;
