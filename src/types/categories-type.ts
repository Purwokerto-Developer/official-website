import { event_categories } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const eventCategorySchema = createInsertSchema(event_categories);
export type Category = InferSelectModel<typeof event_categories>;
