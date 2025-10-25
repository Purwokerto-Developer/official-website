import { pgTable, uuid, text, timestamp, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';

export const settings = pgTable('settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id')
    .unique()
    .references(() => user.id),
  password_last_changed: timestamp('password_last_changed'),
  notification_pref: json('notification_pref'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const settings_relations = relations(settings, ({ one }) => ({
  user: one(user, {
    fields: [settings.user_id],
    references: [user.id],
  }),
}));
