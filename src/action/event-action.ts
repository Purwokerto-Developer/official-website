import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { event_categories } from '../db/schema/event_categories-schema';

type Category = typeof event_categories.$inferSelect;

export async function addCategory({ name, description }: { name: string; description: string }) {
  try {
    const result = await db.insert(event_categories).values({ name, description }).returning();
    return { success: true, data: result };
  } catch (error) {
    console.error('Add category failed:', error);
    return { success: false, error: 'Failed to add category' };
  }
}

export async function editCategory({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) {
  try {
    const result = await db
      .update(event_categories)
      .set({ name, description })
      .where(eq(event_categories.id, id))
      .returning();
    return { success: true, data: result };
  } catch (error) {
    console.error('Edit category failed:', error);
    return { success: false, error: 'Failed to edit category' };
  }
}

export async function getCategories(): Promise<Category[]> {
  return await db.select().from(event_categories).orderBy(event_categories.createdAt);
}
