-- CreateTable
CREATE TABLE "is_user_priority" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "is_user_priority_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "is_user_priority" ADD CONSTRAINT "is_user_priority_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
