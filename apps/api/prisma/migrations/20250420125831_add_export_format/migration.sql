/*
  Warnings:

  - The `format` column on the `exports` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('csv', 'json');

-- AlterTable
ALTER TABLE "exports" ADD COLUMN     "error_message" TEXT,
DROP COLUMN "format",
ADD COLUMN     "format" "ExportFormat" NOT NULL DEFAULT 'csv';
