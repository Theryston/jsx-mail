-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "impersonate_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_impersonate_user_id_fkey" FOREIGN KEY ("impersonate_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
