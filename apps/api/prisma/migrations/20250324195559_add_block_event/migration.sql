-- CreateEnum
CREATE TYPE "BlockedPermissionEventStyle" AS ENUM ('block', 'unblock');

-- CreateTable
CREATE TABLE "blocked_permission_events" (
    "id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "style" "BlockedPermissionEventStyle" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "blocked_permission_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "blocked_permission_events" ADD CONSTRAINT "blocked_permission_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
