import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { event_categories } from './event_categories-schema';
import { user } from '@/db/schema/auth-schema';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  start_time: timestamp('start_time', { withTimezone: true }).notNull(),
  end_time: timestamp('end_time', { withTimezone: true }).notNull(),
  event_type: text('event_type', { enum: ['online', 'offline'] }).notNull(),
  is_attendance_open: boolean('is_attendance_open').default(false).notNull(),
  created_by: text('created_by').references(() => user.id),
  collaborator_id: text('collaborator_id').references(() => user.id),
  category_id: uuid('category_id').references(() => event_categories.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
