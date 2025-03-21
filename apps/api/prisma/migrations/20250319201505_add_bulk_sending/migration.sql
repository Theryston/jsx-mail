-- CreateEnum
CREATE TYPE "BulkSendingStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "bulk_sending_id" TEXT;

-- CreateTable
CREATE TABLE "bulk_sendings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "total_contacts" INTEGER NOT NULL DEFAULT 0,
    "processed_contacts" INTEGER NOT NULL DEFAULT 0,
    "status" "BulkSendingStatus" NOT NULL DEFAULT 'pending',
    "contact_group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_sendings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_bulk_sending_id_fkey" FOREIGN KEY ("bulk_sending_id") REFERENCES "bulk_sendings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sendings" ADD CONSTRAINT "bulk_sendings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sendings" ADD CONSTRAINT "bulk_sendings_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "senders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sendings" ADD CONSTRAINT "bulk_sendings_contact_group_id_fkey" FOREIGN KEY ("contact_group_id") REFERENCES "contact_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
