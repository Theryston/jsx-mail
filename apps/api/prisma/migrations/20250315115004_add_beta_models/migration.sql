-- CreateTable
CREATE TABLE "permissions_requires_beta" (
    "id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permissions_requires_beta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_beta_permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_beta_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_requires_beta_permission_key" ON "permissions_requires_beta"("permission");

-- CreateIndex
CREATE INDEX "permissions_requires_beta_permission_idx" ON "permissions_requires_beta"("permission");

-- AddForeignKey
ALTER TABLE "user_beta_permissions" ADD CONSTRAINT "user_beta_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
