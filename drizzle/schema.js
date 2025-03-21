import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const emailManagement = pgTable('email_management', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
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