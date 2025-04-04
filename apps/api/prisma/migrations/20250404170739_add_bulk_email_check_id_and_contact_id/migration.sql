-- AlterTable
ALTER TABLE "email_checks" ADD COLUMN     "bulk_email_check_id" TEXT,
ADD COLUMN     "contact_id" TEXT;

-- AddForeignKey
ALTER TABLE "email_checks" ADD CONSTRAINT "email_checks_bulk_email_check_id_fkey" FOREIGN KEY ("bulk_email_check_id") REFERENCES "bulk_email_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_checks" ADD CONSTRAINT "email_checks_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
