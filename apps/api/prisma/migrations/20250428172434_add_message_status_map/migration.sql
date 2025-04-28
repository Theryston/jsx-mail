-- CreateTable
CREATE TABLE "message_status_mappings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "whenMessageStatus" "MessageStatus" NOT NULL,
    "whenNewStatus" "MessageStatus" NOT NULL,
    "replaceNewStatusTo" "MessageStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "message_status_mappings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "message_status_mappings" ADD CONSTRAINT "message_status_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
