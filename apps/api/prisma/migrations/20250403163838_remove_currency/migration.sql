/*
  Warnings:

  - You are about to drop the column `currency` on the `default_settings` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `user_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "default_settings" DROP COLUMN "currency";

-- AlterTable
ALTER TABLE "user_settings" DROP COLUMN "currency";
