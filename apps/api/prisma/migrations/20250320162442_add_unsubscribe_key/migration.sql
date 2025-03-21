/*
  Warnings:

  - Added the required column `unsubscribe_key` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "unsubscribe_key" TEXT NOT NULL;
