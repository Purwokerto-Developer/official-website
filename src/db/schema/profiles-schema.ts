import { pgTable, uuid, text, integer, boolean, json, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: text('user_id')
    .unique()
    .references(() => user.id),
  display_name: text('display_name'),
  bio: text('bio'),
  avatar_url: text('avatar_url'),
  social_provider: text('social_provider'),
  social_username: text('social_username'),
  social_url: text('social_url'),
  community_role: text('community_role'),
  links: json('links'),
  location: text('location'),
  is_verified: boolean('is_verified').default(false),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const profiles_relations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.user_id],
    references: [user.id],
  }),
}));
