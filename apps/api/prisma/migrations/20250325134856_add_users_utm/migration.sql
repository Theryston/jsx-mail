-- CreateTable
CREATE TABLE "users_utm" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "utm_name" TEXT NOT NULL,
    "utm_value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_utm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_utm" ADD CONSTRAINT "users_utm_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
