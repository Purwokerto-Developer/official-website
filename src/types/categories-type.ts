import { event_categories } from '@/db/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type Category = InferSelectModel<typeof event_categories>;
export type NewCategory = InferInsertModel<typeof event_categories>;
