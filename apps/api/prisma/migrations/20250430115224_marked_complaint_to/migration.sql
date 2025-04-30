-- CreateTable
CREATE TABLE "marked_complaint_to" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "marked_complaint_to_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "marked_complaint_to" ADD CONSTRAINT "marked_complaint_to_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
