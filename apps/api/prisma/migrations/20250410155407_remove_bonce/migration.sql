/*
  Warnings:

  - The values [bonce] on the enum `MessageStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageStatus_new" AS ENUM ('queued', 'processing', 'sent', 'bounce', 'failed', 'reject', 'complaint', 'delivered', 'delivery_delay', 'subscription', 'opened', 'clicked');
ALTER TABLE "messages" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "messages" ALTER COLUMN "status" TYPE "MessageStatus_new" USING ("status"::text::"MessageStatus_new");
ALTER TABLE "message_status_history" ALTER COLUMN "status" TYPE "MessageStatus_new" USING ("status"::text::"MessageStatus_new");
ALTER TYPE "MessageStatus" RENAME TO "MessageStatus_old";
ALTER TYPE "MessageStatus_new" RENAME TO "MessageStatus";
DROP TYPE "MessageStatus_old";
ALTER TABLE "messages" ALTER COLUMN "status" SET DEFAULT 'queued';
COMMIT;
