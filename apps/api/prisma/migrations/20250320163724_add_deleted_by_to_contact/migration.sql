-- CreateEnum
CREATE TYPE "ContactDeletedBy" AS ENUM ('contactGroupOwner', 'self');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "deleted_by" "ContactDeletedBy" DEFAULT 'contactGroupOwner';
