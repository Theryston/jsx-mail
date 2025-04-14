/*
  Warnings:

  - Added the required column `url` to the `user_utm_group_views` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_utm_group_views" ADD COLUMN     "url" TEXT NOT NULL;
