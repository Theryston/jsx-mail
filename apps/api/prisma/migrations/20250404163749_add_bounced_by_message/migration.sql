/*
  Warnings:

  - The values [sending_webhook] on the enum `BouncedBy` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BouncedBy_new" AS ENUM ('email_check', 'message');
ALTER TABLE "contacts" ALTER COLUMN "bounced_by" TYPE "BouncedBy_new" USING ("bounced_by"::text::"BouncedBy_new");
ALTER TYPE "BouncedBy" RENAME TO "BouncedBy_old";
ALTER TYPE "BouncedBy_new" RENAME TO "BouncedBy";
DROP TYPE "BouncedBy_old";
COMMIT;
