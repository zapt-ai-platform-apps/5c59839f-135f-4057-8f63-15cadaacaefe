CREATE TABLE IF NOT EXISTS "email_management" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT,
  "last_name" TEXT,
  "is_unsubscribed" BOOLEAN DEFAULT FALSE,
  "unsubscribed_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT NOW()
);