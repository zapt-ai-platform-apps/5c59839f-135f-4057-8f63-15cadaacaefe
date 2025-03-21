ALTER TABLE "email_management" ADD COLUMN IF NOT EXISTS "intercom_id" TEXT;
ALTER TABLE "email_management" ADD COLUMN IF NOT EXISTS "last_imported_at" TIMESTAMP;