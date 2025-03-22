/*
  Warnings:

  - Added the required column `title` to the `bulk_sendings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bulk_sendings" ADD COLUMN     "title" TEXT NOT NULL;
