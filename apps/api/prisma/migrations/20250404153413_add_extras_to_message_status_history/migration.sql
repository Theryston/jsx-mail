-- CreateTable
CREATE TABLE "message_status_history_extras" (
    "id" TEXT NOT NULL,
    "message_status_history_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "message_status_history_extras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_status_history_extras" ADD CONSTRAINT "message_status_history_extras_message_status_history_id_fkey" FOREIGN KEY ("message_status_history_id") REFERENCES "message_status_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
