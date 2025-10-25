import { InferSelectModel } from 'drizzle-orm';
import { user } from '@/db/schema';
export type UserType = InferSelectModel<typeof user>;
