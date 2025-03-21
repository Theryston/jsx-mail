/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `senders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "senders_email_key" ON "senders"("email");
