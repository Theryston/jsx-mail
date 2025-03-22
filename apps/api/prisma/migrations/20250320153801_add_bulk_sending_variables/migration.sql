-- CreateTable
CREATE TABLE "bulk_sending_variables" (
    "id" TEXT NOT NULL,
    "bulk_sending_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "fromKey" TEXT NOT NULL,
    "customValue" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "bulk_sending_variables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bulk_sending_variables" ADD CONSTRAINT "bulk_sending_variables_bulk_sending_id_fkey" FOREIGN KEY ("bulk_sending_id") REFERENCES "bulk_sendings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
