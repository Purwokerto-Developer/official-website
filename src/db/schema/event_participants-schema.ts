import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { events } from './event-schema';
import { user } from '@/db/schema/auth-schema';

export const event_participants = pgTable('event_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  event_id: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status', { enum: ['registered', 'attended', 'cancelled'] }).default('registered'),
  qr_code: text('qr_code'),
  attendance_time: timestamp('attendance_time', { withTimezone: true }),
  joined_at: timestamp('joined_at').defaultNow(),
  cancelled_at: timestamp('cancelled_at', { withTimezone: true }),
});
