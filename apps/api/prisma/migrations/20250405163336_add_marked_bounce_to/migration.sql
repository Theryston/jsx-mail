-- CreateTable
CREATE TABLE "marked_bounce_to" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bounce_by" "BouncedBy" NOT NULL DEFAULT 'email_check',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "marked_bounce_to_pkey" PRIMARY KEY ("id")
);
