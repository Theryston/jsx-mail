/*
  Warnings:

  - You are about to drop the column `replaceNewStatusTo` on the `message_status_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `whenMessageStatus` on the `message_status_mappings` table. All the data in the column will be lost.
  - You are about to drop the column `whenNewStatus` on the `message_status_mappings` table. All the data in the column will be lost.
  - Added the required column `replace_new_status_to` to the `message_status_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `when_message_status` to the `message_status_mappings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `when_new_status` to the `message_status_mappings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message_status_mappings" DROP COLUMN "replaceNewStatusTo",
DROP COLUMN "whenMessageStatus",
DROP COLUMN "whenNewStatus",
ADD COLUMN     "replace_new_status_to" "MessageStatus" NOT NULL,
ADD COLUMN     "when_message_status" "MessageStatus" NOT NULL,
ADD COLUMN     "when_new_status" "MessageStatus" NOT NULL;

-- CreateTable
CREATE TABLE "message_status_replaced" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "old_status" "MessageStatus" NOT NULL,
    "original_new_status" "MessageStatus" NOT NULL,
    "replaced_new_status" "MessageStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "message_status_replaced_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_status_replaced" ADD CONSTRAINT "message_status_replaced_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
