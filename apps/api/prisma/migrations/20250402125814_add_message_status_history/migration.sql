-- CreateTable
CREATE TABLE "message_status_history" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_status_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_status_history" ADD CONSTRAINT "message_status_history_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
