CREATE TABLE IF NOT EXISTS "email_broadcasts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "sent_at" TIMESTAMP DEFAULT NOW()
);