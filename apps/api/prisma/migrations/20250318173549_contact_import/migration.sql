-- CreateTable
CREATE TABLE "contact_imports" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "email_column" TEXT NOT NULL,
    "name_column" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "contact_group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contact_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_import_failures" (
    "id" TEXT NOT NULL,
    "contact_import_id" TEXT NOT NULL,
    "line" INTEGER,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contact_import_failures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contact_imports" ADD CONSTRAINT "contact_imports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_imports" ADD CONSTRAINT "contact_imports_contact_group_id_fkey" FOREIGN KEY ("contact_group_id") REFERENCES "contact_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_imports" ADD CONSTRAINT "contact_imports_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_import_failures" ADD CONSTRAINT "contact_import_failures_contact_import_id_fkey" FOREIGN KEY ("contact_import_id") REFERENCES "contact_imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
