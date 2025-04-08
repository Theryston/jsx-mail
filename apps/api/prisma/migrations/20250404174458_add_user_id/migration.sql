/*
  Warnings:

  - Added the required column `user_id` to the `bulk_email_checks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `email_checks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bulk_email_checks" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "email_checks" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "bulk_email_checks" ADD CONSTRAINT "bulk_email_checks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_checks" ADD CONSTRAINT "email_checks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
