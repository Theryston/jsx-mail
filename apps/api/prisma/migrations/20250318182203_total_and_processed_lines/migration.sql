-- AlterTable
ALTER TABLE "contact_imports" ADD COLUMN     "processed_lines" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_lines" INTEGER NOT NULL DEFAULT 0;
