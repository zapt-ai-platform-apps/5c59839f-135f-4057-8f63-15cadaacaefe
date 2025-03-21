CREATE TABLE IF NOT EXISTS "email_receipts" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email_management_id" UUID REFERENCES email_management(id),
  "email_broadcast_id" UUID REFERENCES email_broadcasts(id),
  "sent_at" TIMESTAMP DEFAULT NOW()
);