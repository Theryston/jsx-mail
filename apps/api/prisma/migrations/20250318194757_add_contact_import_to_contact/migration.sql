-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "contact_import_id" TEXT;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_contact_import_id_fkey" FOREIGN KEY ("contact_import_id") REFERENCES "contact_imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
