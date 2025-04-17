-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "webhook_status" "MessageStatus"[] DEFAULT ARRAY[]::"MessageStatus"[],
ADD COLUMN     "webhook_url" TEXT;
