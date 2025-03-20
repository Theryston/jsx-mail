/*
  Warnings:

  - Changed the type of `from` on the `bulk_sending_variables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BulkSendingVariableFrom" AS ENUM ('custom', 'contact', 'bulk_sending');

-- AlterTable
ALTER TABLE "bulk_sending_variables" DROP COLUMN "from",
ADD COLUMN     "from" "BulkSendingVariableFrom" NOT NULL;
