-- AlterTable
ALTER TABLE "users_utm" ADD COLUMN     "group_id" TEXT;

-- CreateTable
CREATE TABLE "user_utm_groups" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_utm_groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_utm_groups" ADD CONSTRAINT "user_utm_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_utm" ADD CONSTRAINT "users_utm_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "user_utm_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
