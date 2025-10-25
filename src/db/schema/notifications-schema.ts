import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { articles } from './articles-schema';
import { events } from './event-schema';

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'event', 'article', 'system', 'community', etc.
  reference_id: uuid('reference_id'),
  is_read: boolean('is_read').default(false),
  created_at: timestamp('created_at').defaultNow(),
});

export const notifications_relations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.user_id],
    references: [user.id],
  }),
  article: one(articles, {
    fields: [notifications.reference_id],
    references: [articles.id],
  }),
  event: one(events, {
    fields: [notifications.reference_id],
    references: [events.id],
  }),
}));
