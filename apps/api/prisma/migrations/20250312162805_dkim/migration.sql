-- CreateTable
CREATE TABLE "dkim" (
    "id" TEXT NOT NULL,
    "domain_id" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "dkim_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dkim" ADD CONSTRAINT "dkim_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "domains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
