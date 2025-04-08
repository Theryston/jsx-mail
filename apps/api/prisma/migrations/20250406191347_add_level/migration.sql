-- CreateEnum
CREATE TYPE "EmailCheckLevel" AS ENUM ('safely', 'valid');

-- AlterTable
ALTER TABLE "bulk_email_checks" ADD COLUMN     "level" "EmailCheckLevel" NOT NULL DEFAULT 'valid';

-- AlterTable
ALTER TABLE "email_checks" ADD COLUMN     "level" "EmailCheckLevel" NOT NULL DEFAULT 'valid';
