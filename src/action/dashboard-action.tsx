// Use string keys for icons so the returned state is serializable
import { DashboardState } from '@/types/dashboard-state-type';
import { db } from '@/db';
import { events } from '@/db/schema/event-schema';
import { articles } from '@/db/schema/articles-schema';
import { eq, lt, gt, count } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';

export async function getDashboardStates(): Promise<DashboardState[]> {
  const session = await getServerSession();
  const userId = session?.user?.id;

  const now = new Date();

  // Run all COUNT queries in parallel — much faster than SELECT *
  const [totalResult, upcomingResult, pastResult, articlesResult] = await Promise.all([
    db.select({ count: count() }).from(events),
    db.select({ count: count() }).from(events).where(gt(events.start_time, now)),
    db.select({ count: count() }).from(events).where(lt(events.start_time, now)),
    userId
      ? db.select({ count: count() }).from(articles).where(eq(articles.author_id, userId))
      : Promise.resolve([{ count: 0 }]),
  ]);

  const totalCount = totalResult[0]?.count ?? 0;
  const upcomingCount = upcomingResult[0]?.count ?? 0;
  const pastCount = pastResult[0]?.count ?? 0;
  const articlesCount = articlesResult[0]?.count ?? 0;

  return [
    {
      title: 'Total Events',
      description: 'Jumlah seluruh event yang terdaftar.',
      // use a string key for the icon to keep the returned data plain
      icon: 'MoneySend',
      count: totalCount,
      status: 'Aktif',
    },
    {
      title: 'Upcoming',
      description: 'Event yang akan datang dalam bulan ini.',
      icon: 'Calendar',
      count: upcomingCount,
      status: upcomingCount > 0 ? 'Ada Event' : 'Tidak Ada',
    },
    {
      title: 'My Articles',
      description: 'Artikel yang telah kamu publikasikan.',
      icon: 'DocumentText',
      count: articlesCount,
      status: articlesCount > 0 ? 'Aktif' : 'Belum Ada',
    },
    {
      title: 'Past Events',
      description: 'Event yang sudah selesai.',
      icon: 'Archive',
      count: pastCount,
      status: pastCount > 0 ? 'Sudah Selesai' : 'Belum Ada',
    },
  ];
}

export type UpcomingEvent = {
  id: string | number;
  title: string;
  date: string;
  status: 'online' | 'offline' | string;
  eventStatus: 'Upcoming' | 'Past' | string;
  registered: boolean;
  location: string;
  image?: string | null;
  description?: string | null;
};

export async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      start_time: events.start_time,
      event_type: events.event_type,
      location_name: events.location_name,
      image: events.image,
      description: events.description,
    })
    .from(events)
    .where(gt(events.start_time, new Date()));

  return rows.map((r: any, i: number) => ({
    id: r.id ?? i + 1,
    title: r.title ?? 'Untitled Event',
    date: r.start_time
      ? r.start_time instanceof Date
        ? r.start_time.toLocaleString()
        : String(r.start_time)
      : 'TBA',
    status: r.event_type ?? 'offline',
    eventStatus: 'Upcoming',
    registered: false,
    location: r.location_name ?? 'TBA',
    image: r.image ?? null,
    description: r.description ?? null,
  }));
}
