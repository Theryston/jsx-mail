/*
  Warnings:

  - You are about to drop the `BulkEmailCheck` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BulkEmailCheckStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- DropTable
DROP TABLE "BulkEmailCheck";

-- CreateTable
CREATE TABLE "bulk_email_checks" (
    "id" TEXT NOT NULL,
    "contact_group_id" TEXT,
    "status" "BulkEmailCheckStatus" NOT NULL DEFAULT 'pending',
    "total_emails" INTEGER NOT NULL DEFAULT 0,
    "processed_emails" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_email_checks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bulk_email_checks" ADD CONSTRAINT "bulk_email_checks_contact_group_id_fkey" FOREIGN KEY ("contact_group_id") REFERENCES "contact_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
