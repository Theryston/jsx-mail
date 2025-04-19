/*
  Warnings:

  - You are about to drop the column `message_status` on the `user_webhooks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_webhooks" DROP COLUMN "message_status",
ADD COLUMN     "message_statuses" "MessageStatus"[];
