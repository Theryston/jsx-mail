-- AlterTable
ALTER TABLE "default_settings" ALTER COLUMN "max_file_size" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_balance_to_be_eligible_for_free" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "free_emails_per_month" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "min_balance_to_add" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "storage_gb_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "price_per_message" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_storage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "global_max_messages_per_second" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "global_max_messages_per_day" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "gap_to_check_security_insights" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "min_emails_for_rate_calculation" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_security_codes_per_hour" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_security_codes_per_minute" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "user_settings" ALTER COLUMN "max_file_size" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_balance_to_be_eligible_for_free" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "free_emails_per_month" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "min_balance_to_add" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "storage_gb_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "price_per_message" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_storage" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "gap_to_check_security_insights" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "min_emails_for_rate_calculation" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_security_codes_per_hour" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_security_codes_per_minute" SET DATA TYPE DOUBLE PRECISION;
