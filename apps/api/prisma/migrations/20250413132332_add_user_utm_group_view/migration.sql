/*
  Warnings:

  - You are about to drop the `user_utm_views` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_utm_views" DROP CONSTRAINT "user_utm_views_user_utm_id_fkey";

-- DropTable
DROP TABLE "user_utm_views";

-- CreateTable
CREATE TABLE "user_utm_group_views" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_utm_group_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_utm_group_views" ADD CONSTRAINT "user_utm_group_views_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "user_utm_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
