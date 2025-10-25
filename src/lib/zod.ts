import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { events } from '../db/schema/event-schema';
import { event_categories } from '../db/schema/event_categories-schema';

export const eventSelectSchema = createSelectSchema(events);
export const eventInsertSchema = createInsertSchema(events);
export const categoryInsertSchema = createInsertSchema(event_categories);
