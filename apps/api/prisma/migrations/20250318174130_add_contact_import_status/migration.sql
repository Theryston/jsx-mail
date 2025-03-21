-- CreateEnum
CREATE TYPE "ContactImportStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- AlterTable
ALTER TABLE "contact_imports" ADD COLUMN     "status" "ContactImportStatus" NOT NULL DEFAULT 'pending';
