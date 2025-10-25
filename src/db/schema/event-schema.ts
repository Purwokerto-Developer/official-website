import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { event_categories } from './event_categories-schema';
import { user } from '@/db/schema/auth-schema';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  location_name: text('location_name').notNull(),
  location_url: text('location_url'),
  start_time: timestamp('start_time', { withTimezone: true }).notNull(),
  event_type: text('event_type', { enum: ['online', 'offline'] }).notNull(),
  is_attendance_open: boolean('is_attendance_open').default(false).notNull(),
  qr_token: text('qr_token'), // Secure token for QR code attendance
  image: text('image'),
  // Store ImageKit file id for safe deletion
  image_file_id: text('image_file_id'),
  collaborator_id: text('collaborator_id').references(() => user.id),
  category_id: uuid('category_id').references(() => event_categories.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const eventsRelations = relations(events, ({ one }) => ({
  category: one(event_categories, {
    fields: [events.category_id],
    references: [event_categories.id],
  }),
  colaborator: one(user, {
    fields: [events.collaborator_id],
    references: [user.id],
  }),
}));
