ALTER TABLE "email_management" DROP COLUMN IF EXISTS "first_name";
ALTER TABLE "email_management" DROP COLUMN IF EXISTS "last_name";

CREATE TABLE IF NOT EXISTS "import_state" (
  "id" SERIAL PRIMARY KEY,
  "source" TEXT NOT NULL UNIQUE,
  "last_cursor" TEXT,
  "last_contact_id" TEXT,
  "last_updated_at" TIMESTAMP DEFAULT NOW(),
  "is_in_progress" BOOLEAN DEFAULT FALSE,
  "updated_at" TIMESTAMP DEFAULT NOW()
);