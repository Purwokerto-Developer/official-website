'use server';

import { db } from '@/db';
import { success, fail, QueryResult } from '@/lib/return-helper';
import { events } from '@/db/schema/event-schema';
import { event_categories } from '@/db/schema/event_categories-schema';
import { user } from '../../auth-schema';
import { eventInsertSchema, categoryInsertSchema } from '@/lib/zod';
import { Category } from '@/types/categories-type';
import { asc, eq, ilike, or, and, getTableColumns, type InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';
import ImageKit from 'imagekit';
import type { EventDetail } from '@/types/event-type';
import { deslugify, slugify } from '@/lib/utils';
import { getServerSession } from '@/lib/better-auth/get-session';
import { event_participants } from '@/db/schema/event_participants-schema';

export type Event = z.infer<typeof eventInsertSchema>;

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

type EventWithRelations = InferSelectModel<typeof events> & {
  category_name: string | null;
  collaborator_name: string | null;
};

export async function getEvent(
  page = 1,
  pageSize = 5,
  search = '',
): Promise<QueryResult<EventWithRelations[]>> {
  try {
    const baseQuery = db
      .select({
        ...getTableColumns(events),
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

export async function getEventById(id: string): Promise<QueryResult<EventDetail>> {
  try {
    const result = await db
      .select({
        ...getTableColumns(events),
        category_name: event_categories.name,
        collaborator_name: user.name,
      })
      .from(events)
      .leftJoin(event_categories, eq(events.category_id, event_categories.id))
      .leftJoin(user, eq(events.collaborator_id, user.id))
      .where(eq(events.id, id))
      .limit(1);

    if (!result || result.length === 0) {
      return fail<EventDetail>(`Event with ID ${id} not found`);
    }

    return success<EventDetail>(result[0] as EventDetail);
  } catch (error) {
    console.error('❌ Get event by ID failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch event by ID');
  }
}

export async function getEventBySlug(slug: string): Promise<QueryResult<EventDetail>> {
  try {
    const title = deslugify(slug);
    const result = await db
      .select({
        ...getTableColumns(events),
        category_name: event_categories.name,
        collaborator_name: user.name,
      })
      .from(events)
      .leftJoin(event_categories, eq(events.category_id, event_categories.id))
      .leftJoin(user, eq(events.collaborator_id, user.id))
      .where(eq(events.slug, slug))
      .limit(1);

    if (!result || result.length === 0) {
      return fail<EventDetail>(`Event with slug ${slug} not found`);
    }

    return success<EventDetail>(result[0] as EventDetail);
  } catch (error) {
    console.error('❌ Get event by slug failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch event by slug');
  }
}

export async function createEventWithImage(
  formData: FormData,
): Promise<QueryResult<InferSelectModel<typeof events>[]>> {
  try {
    const image = formData.get('image');
    if (!image) throw new Error('Image file is required');

    let fileName = 'event-image';
    let buffer: Buffer;
    if (image instanceof File) {
      buffer = Buffer.from(await image.arrayBuffer());
      fileName = image.name || fileName;
    } else {
      throw new Error('Unsupported image type');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location_name = formData.get('location_name') as string;
    const location_url = (formData.get('location_url') as string) || null;
    const event_type = formData.get('event_type') as 'online' | 'offline';
    const category_id = formData.get('category_id') as string;
    const collaborator_id = formData.get('collaborator_id') as string | null;
    const start_time = new Date(formData.get('start_time') as string);

    // Validate without slug; slug is generated server-side
    const eventCreateServerSchema = eventInsertSchema.omit({ slug: true });
    const parsed = eventCreateServerSchema.parse({
      title,
      description,
      location_name,
      event_type,
      category_id,
      collaborator_id,
      start_time,
      location_url,
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
        slug: slugify(parsed.title),
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

export async function deleteEvent(id: string): Promise<QueryResult<InferSelectModel<typeof events>[]>> {
  try {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return success(result);
  } catch (error) {
    console.error('❌ Delete event failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to delete event');
  }
}

export async function updateEventWithImage(
  id: string,
  formData: FormData,
): Promise<QueryResult<InferSelectModel<typeof events>[]>> {
  try {
    const title = formData.get('title') as string;
    const description = (formData.get('description') as string) ?? '';
    const location_name = formData.get('location_name') as string;
    const location_url = (formData.get('location_url') as string) || null;
    const event_type = formData.get('event_type') as 'online' | 'offline';
    const category_id = formData.get('category_id') as string;
    const collaborator_id = (formData.get('collaborator_id') as string) || null;
    const start_time = new Date(formData.get('start_time') as string);

    const toValidate = eventInsertSchema.omit({ slug: true }).parse({
      title,
      description,
      location_name,
      event_type,
      category_id,
      collaborator_id,
      start_time,
      location_url,
    });

    const image = formData.get('image');
    let newImageUrl: string | undefined;
    if (image && image instanceof File) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: image.name || 'event-image',
        folder: '/events',
        useUniqueFileName: true,
      });
      if (!uploadResponse.url) throw new Error('Image upload failed');
      newImageUrl = uploadResponse.url;
    }

    const result = await db
      .update(events)
      .set({
        ...toValidate,
        slug: slugify(toValidate.title),
        image: newImageUrl ?? undefined,
        updated_at: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    return success(result);
  } catch (error) {
    console.error('❌ Update event failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to update event');
  }
}

export async function setAttendanceOpen(
  eventId: string,
  open: boolean,
): Promise<QueryResult<InferSelectModel<typeof events>[]>> {
  try {
    const result = await db
      .update(events)
      .set({ is_attendance_open: open, updated_at: new Date() })
      .where(eq(events.id, eventId))
      .returning();
    return success(result);
  } catch (error) {
    console.error('❌ Toggle attendance failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to toggle attendance');
  }
}

export async function joinEvent(eventId: string): Promise<QueryResult<InferSelectModel<typeof event_participants>[]>> {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return fail('Not authenticated');

    // Ensure event date not passed
    const [evt] = await db.select({ id: events.id, start_time: events.start_time }).from(events).where(eq(events.id, eventId)).limit(1);
    if (!evt) return fail('Event not found');
    if (new Date(evt.start_time) < new Date()) return fail('Event Ended');

    const inserted = await db
      .insert(event_participants)
      .values({ event_id: eventId, user_id: userId })
      .onConflictDoNothing()
      .returning();
    return success(inserted);
  } catch (error) {
    console.error('❌ Join event failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to join event');
  }
}


export type EventParticipantRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  status: 'registered' | 'attended' | 'cancelled';
  joined_at: Date | null;
  attendance_time: Date | null;
};

export async function getEventParticipants(eventId: string): Promise<QueryResult<EventParticipantRow[]>> {
  try {
    const rows = await db
      .select({
        id: event_participants.id,
        email: user.email,
        name: user.name,
        image: (user as any).image ?? (user as any).avatar ?? null,
        status: event_participants.status,
        joined_at: event_participants.joined_at,
        attendance_time: event_participants.attendance_time,
      })
      .from(event_participants)
      .leftJoin(user, eq(event_participants.user_id, user.id))
      .where(eq(event_participants.event_id, eventId))
      .orderBy(asc(event_participants.joined_at));
    return success(rows as EventParticipantRow[]);
  } catch (error) {
    console.error('❌ Get participants failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch participants');
  }
}

export async function checkUserEventStatus(eventId: string): Promise<QueryResult<{ isJoined: boolean; hasAttended: boolean }>> {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return fail('Not authenticated');

    const participant = await db
      .select({
        status: event_participants.status,
      })
      .from(event_participants)
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .limit(1);

    const isJoined = participant.length > 0 && participant[0].status !== 'cancelled';
    const hasAttended = participant.length > 0 && participant[0].status === 'attended';

    return success({ isJoined, hasAttended });
  } catch (error) {
    console.error('❌ Check user event status failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to check user event status');
  }
}

export async function cancelEventJoin(eventId: string): Promise<QueryResult<InferSelectModel<typeof event_participants>[]>> {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return fail('Not authenticated');

    const updated = await db
      .update(event_participants)
      .set({ status: 'cancelled', cancelled_at: new Date() })
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .returning();
    
    return success(updated);
  } catch (error) {
    console.error('❌ Cancel event join failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to cancel event join');
  }
}

export async function markAttendance(eventId: string): Promise<QueryResult<InferSelectModel<typeof event_participants>[]>> {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return fail('Not authenticated');

    // Check if attendance is open
    const [evt] = await db.select({ is_attendance_open: events.is_attendance_open }).from(events).where(eq(events.id, eventId)).limit(1);
    if (!evt?.is_attendance_open) return fail('Attendance is not open');

    // Check current participant status before updating
    const [participant] = await db
      .select()
      .from(event_participants)
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .limit(1);

    if (!participant) return fail('You must join the event first');
    
    // Check if already attended - return friendly message instead of error
    if (participant.status === 'attended') {
      return fail('You have already marked attendance for this event');
    }

    const updated = await db
      .update(event_participants)
      .set({ status: 'attended', attendance_time: new Date() })
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .returning();
    
    return success(updated);
  } catch (error) {
    console.error('❌ Mark attendance failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to mark attendance');
  }
}

export async function getUsers(): Promise<QueryResult<{ id: string; name: string; email: string }[]>> {
  try {
    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .orderBy(asc(user.name));

    return success(result);
  } catch (error) {
    console.error('❌ Get users failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to fetch users');
  }
}

export async function attendEventViaQR(qrDataString: string): Promise<QueryResult<InferSelectModel<typeof event_participants>[]>> {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id;
    if (!userId) return fail('Not authenticated');

    // Parse QR data
    const qrData = JSON.parse(qrDataString);
    const { eventId, token } = qrData;

    if (!eventId || !token) {
      return fail('Invalid QR code format');
    }

    // Get event and verify token
    const [evt] = await db
      .select({
        id: events.id,
        is_attendance_open: events.is_attendance_open,
        qr_token: events.qr_token,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!evt) return fail('Event not found');
    if (!evt.is_attendance_open) return fail('Attendance is not open');
    if (evt.qr_token !== token) return fail('Invalid QR code');

    // Check if user has joined the event and current status
    const [participant] = await db
      .select()
      .from(event_participants)
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .limit(1);

    if (!participant) return fail('You must join the event first');
    
    // Check if already attended - return friendly message instead of error
    if (participant.status === 'attended') {
      return fail('You have already marked attendance for this event');
    }

    // Mark attendance
    const updated = await db
      .update(event_participants)
      .set({ status: 'attended', attendance_time: new Date() })
      .where(and(eq(event_participants.event_id, eventId), eq(event_participants.user_id, userId)))
      .returning();

    return success(updated);
  } catch (error) {
    console.error('❌ QR attendance failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to mark attendance via QR');
  }
}

export async function generateQRToken(eventId: string): Promise<QueryResult<{ token: string }>> {
  try {
    // Generate secure random token
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    // Update event with new token
    await db
      .update(events)
      .set({ qr_token: token, updated_at: new Date() })
      .where(eq(events.id, eventId));

    return success({ token });
  } catch (error) {
    console.error('❌ Generate QR token failed:', error);
    return fail(error instanceof Error ? error.message : 'Failed to generate QR token');
  }
}
