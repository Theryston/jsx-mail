-- AlterTable
ALTER TABLE "users_utm" ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "user_utm_views" (
    "id" TEXT NOT NULL,
    "user_utm_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_utm_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_utm_views" ADD CONSTRAINT "user_utm_views_user_utm_id_fkey" FOREIGN KEY ("user_utm_id") REFERENCES "users_utm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
