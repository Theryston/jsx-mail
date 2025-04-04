/*
  Warnings:

  - Added the required column `global_emails_check_per_second` to the `default_settings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_email_check` to the `default_settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "default_settings" ADD COLUMN     "global_emails_check_per_second" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "price_per_email_check" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user_settings" ADD COLUMN     "price_per_email_check" DOUBLE PRECISION;
