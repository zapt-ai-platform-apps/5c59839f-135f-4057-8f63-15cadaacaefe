import { pgTable, uuid, text, boolean, timestamp, serial } from 'drizzle-orm/pg-core';

export const emailManagement = pgTable('email_management', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  // Removed firstName and lastName fields
  isUnsubscribed: boolean('is_unsubscribed').default(false),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  intercomId: text('intercom_id'),
  lastImportedAt: timestamp('last_imported_at')
});

export const emailBroadcasts = pgTable('email_broadcasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  sentAt: timestamp('sent_at').defaultNow()
});

export const emailReceipts = pgTable('email_receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailManagementId: uuid('email_management_id').references(() => emailManagement.id),
  emailBroadcastId: uuid('email_broadcast_id').references(() => emailBroadcasts.id),
  sentAt: timestamp('sent_at').defaultNow()
});

export const importState = pgTable('import_state', {
  id: serial('id').primaryKey(),
  source: text('source').notNull().unique(),
  lastCursor: text('last_cursor'),
  lastContactId: text('last_contact_id'),
  lastUpdatedAt: timestamp('last_updated_at').defaultNow(),
  isInProgress: boolean('is_in_progress').default(false),
  updatedAt: timestamp('updated_at').defaultNow()
});