-- CreateTable
CREATE TABLE "blocked_permissions" (
    "id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "blocked_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocked_permissions_permission_key" ON "blocked_permissions"("permission");

-- AddForeignKey
ALTER TABLE "blocked_permissions" ADD CONSTRAINT "blocked_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
