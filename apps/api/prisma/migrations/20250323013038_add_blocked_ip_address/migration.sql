-- CreateTable
CREATE TABLE "blocked_ip_addresses" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "blocked_ip_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocked_ip_addresses_ipAddress_key" ON "blocked_ip_addresses"("ipAddress");
