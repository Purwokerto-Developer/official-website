import { pgTable, uuid, text, timestamp, real } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  author_id: text('author_id').references(() => user.id),
  ai_originality_score: real('ai_originality_score'),
  ai_checked_at: timestamp('ai_checked_at'),
  status: text('status', {
    enum: ['draft', 'pending_ai', 'pending_approval', 'approved', 'rejected'],
  })
    .default('draft')
    .notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
