import { DashboardState } from '@/types/dashboard-state-type';
import { db } from '@/db';
import { events } from '@/db/schema/event-schema';
import { articles } from '@/db/schema/articles-schema';
import { MoneySend, Calendar, DocumentText, Archive } from 'iconsax-reactjs';
import { eq, lt, gt } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';

export async function getDashboardStates(): Promise<DashboardState[]> {
  const session = await getServerSession();
  const userId = session?.user?.id;

  // Total event
  const totalEvents = await db.select().from(events);
  // Upcoming event (start_time > hari ini)
  const upcomingEvents = await db.select().from(events).where(gt(events.start_time, new Date()));
  // Past event (start_time < hari ini)
  const pastEvents = await db.select().from(events).where(lt(events.start_time, new Date()));
  // Artikel user
  let myArticles = [];
  if (userId) {
    myArticles = await db.select().from(articles).where(eq(articles.author_id, userId));
  }

  return [
    {
      title: 'Total Events',
      description: 'Jumlah seluruh event yang terdaftar.',
      icon: MoneySend,
      count: totalEvents.length,
      status: 'Aktif',
    },
    {
      title: 'Upcoming',
      description: 'Event yang akan datang dalam bulan ini.',
      icon: Calendar,
      count: upcomingEvents.length,
      status: upcomingEvents.length > 0 ? 'Ada Event' : 'Tidak Ada',
    },
    {
      title: 'My Articles',
      description: 'Artikel yang telah kamu publikasikan.',
      icon: DocumentText,
      count: myArticles.length,
      status: myArticles.length > 0 ? 'Aktif' : 'Belum Ada',
    },
    {
      title: 'Past Events',
      description: 'Event yang sudah selesai.',
      icon: Archive,
      count: pastEvents.length,
      status: pastEvents.length > 0 ? 'Sudah Selesai' : 'Belum Ada',
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
