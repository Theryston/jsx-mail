-- CreateTable
CREATE TABLE "bulk_email_check_failures" (
    "id" TEXT NOT NULL,
    "bulk_email_check_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_email_check_failures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bulk_email_check_failures" ADD CONSTRAINT "bulk_email_check_failures_bulk_email_check_id_fkey" FOREIGN KEY ("bulk_email_check_id") REFERENCES "bulk_email_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
