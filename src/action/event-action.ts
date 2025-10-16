'use server';

import { db } from '@/db';
import { success, fail, QueryResult } from '@/lib/return-helper';
import { events } from '@/db/schema/event-schema';
import { event_categories } from '@/db/schema/event_categories-schema';
import { user } from '../../auth-schema';
import { eventInsertSchema, categoryInsertSchema } from '@/lib/zod';
import { Category } from '@/types/categories-type';
import { asc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';
import ImageKit from 'imagekit';

export type Event = z.infer<typeof eventInsertSchema>;

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function getEvent(page = 1, pageSize = 5, search = '') {
  try {
    const baseQuery = db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        address: events.address,
        event_type: events.event_type,
        image: events.image,
        start_time: events.start_time,
        created_at: events.created_at,
        updated_at: events.updated_at,
        category_name: event_categories.name,
        collaborator_name: user.name,
      })
      .from(events)
      .leftJoin(event_categories, eq(events.category_id, event_categories.id))
      .leftJoin(user, eq(events.collaborator_id, user.id));

    const query = search
      ? baseQuery.where(
          or(
            ilike(events.title, `%${search}%`),
            ilike(event_categories.name, `%${search}%`),
            ilike(user.name, `%${search}%`),
          ),
        )
      : baseQuery;

    const result = await query
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .orderBy(asc(events.created_at))
      .execute();

    return success(result);
  } catch (error) {
    console.error('❌ Get events failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch events');
  }
}

export async function createEventWithImage(formData: FormData) {
  try {
    const image = formData.get('image');
    if (!image) throw new Error('Image file is required');

    let fileName = 'event-image';
    let buffer: Buffer;
    if (typeof image === 'object' && 'arrayBuffer' in image) {
      buffer = Buffer.from(await (image as any).arrayBuffer());
      fileName = (image as any).name || fileName;
    } else {
      throw new Error('Unsupported image type');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;
    const event_type = formData.get('event_type') as 'online' | 'offline';
    const category_id = formData.get('category_id') as string;
    const collaborator_id = formData.get('collaborator_id') as string | null;
    const start_time = new Date(formData.get('start_time') as string);

    const parsed = eventInsertSchema.parse({
      title,
      description,
      address,
      event_type,
      category_id,
      collaborator_id,
      start_time,
    });

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      folder: '/events',
      useUniqueFileName: true,
    });

    if (!uploadResponse.url) throw new Error('Image upload failed');

    const result = await db
      .insert(events)
      .values({
        ...parsed,
        image: uploadResponse.url,
      })
      .returning();

    return success(result);
  } catch (error) {
    console.error('❌ Create event failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to create event');
  }
}

export async function addCategory(data: unknown): Promise<QueryResult<Category[]>> {
  try {
    const parsed = categoryInsertSchema.parse(data);
    const result = await db.insert(event_categories).values(parsed).returning();
    return success(result);
  } catch (error) {
    console.error('❌ Add category failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to add category');
  }
}

export async function editCategory(id: string, data: unknown): Promise<QueryResult<Category[]>> {
  try {
    const parsed = categoryInsertSchema.parse(data);
    const result = await db
      .update(event_categories)
      .set({ ...parsed, updatedAt: new Date() })
      .where(eq(event_categories.id, id))
      .returning();
    return success(result);
  } catch (error) {
    console.error('❌ Edit category failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to edit category');
  }
}

export async function deleteCategory(id: string): Promise<QueryResult<Category[]>> {
  try {
    const result = await db.delete(event_categories).where(eq(event_categories.id, id)).returning();
    return success(result);
  } catch (error) {
    console.error('❌ Delete category failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to delete category');
  }
}

export async function getCategories(): Promise<QueryResult<Category[]>> {
  try {
    const result = await db
      .select()
      .from(event_categories)
      .orderBy(asc(event_categories.createdAt));

    return success(result);
  } catch (error) {
    console.error('❌ Get categories failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch categories');
  }
}
