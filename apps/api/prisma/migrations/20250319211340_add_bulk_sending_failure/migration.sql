-- CreateTable
CREATE TABLE "bulk_sending_failures" (
    "id" TEXT NOT NULL,
    "bulk_sending_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contact_id" TEXT,
    "line" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_sending_failures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bulk_sending_failures" ADD CONSTRAINT "bulk_sending_failures_bulk_sending_id_fkey" FOREIGN KEY ("bulk_sending_id") REFERENCES "bulk_sendings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sending_failures" ADD CONSTRAINT "bulk_sending_failures_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
