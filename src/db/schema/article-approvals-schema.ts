import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { articles } from './articles-schema';
import { user } from './auth-schema';

export const article_approvals = pgTable('article_approvals', {
  id: uuid('id').defaultRandom().primaryKey(),
  article_id: uuid('article_id').references(() => articles.id, { onDelete: 'cascade' }),
  admin_id: text('admin_id').references(() => user.id),
  status: text('status', { enum: ['approved', 'rejected'] }).notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow(),
});
