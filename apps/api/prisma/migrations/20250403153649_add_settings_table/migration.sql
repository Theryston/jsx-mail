-- CreateTable
CREATE TABLE "default_settings" (
    "id" TEXT NOT NULL,
    "max_file_size" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "max_balance_to_be_eligible_for_free" INTEGER NOT NULL,
    "free_emails_per_month" INTEGER NOT NULL,
    "min_balance_to_add" INTEGER NOT NULL,
    "storage_gb_price" INTEGER NOT NULL,
    "price_per_message" INTEGER NOT NULL,
    "max_storage" INTEGER NOT NULL,
    "global_max_messages_per_second" INTEGER NOT NULL,
    "global_max_messages_per_day" INTEGER NOT NULL,
    "bounce_rate_limit" DOUBLE PRECISION NOT NULL,
    "complaint_rate_limit" DOUBLE PRECISION NOT NULL,
    "gap_to_check_security_insights" INTEGER NOT NULL,
    "min_emails_for_rate_calculation" INTEGER NOT NULL,
    "max_security_codes_per_hour" INTEGER NOT NULL,
    "max_security_codes_per_minute" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "default_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL,
    "max_file_size" INTEGER,
    "currency" TEXT,
    "max_balance_to_be_eligible_for_free" INTEGER,
    "free_emails_per_month" INTEGER,
    "min_balance_to_add" INTEGER,
    "storage_gb_price" INTEGER,
    "price_per_message" INTEGER,
    "max_storage" INTEGER,
    "bounce_rate_limit" DOUBLE PRECISION,
    "complaint_rate_limit" DOUBLE PRECISION,
    "gap_to_check_security_insights" INTEGER,
    "min_emails_for_rate_calculation" INTEGER,
    "max_security_codes_per_hour" INTEGER,
    "max_security_codes_per_minute" INTEGER,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
