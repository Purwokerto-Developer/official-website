import { db } from '@/db';
import { events, event_categories } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';
import NavbarSection from '@/components/navbar';
import FooterSection from '@/components/landing/footer-section';
import { Calendar, Location, Timer1 } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Events — PurwokertoDev',
  description: 'Event dan meetup dari komunitas developer Purwokerto',
};

async function getPublicEvents() {
  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      description: events.description,
      location_name: events.location_name,
      start_time: events.start_time,
      event_type: events.event_type,
      image: events.image,
      category_name: event_categories.name,
    })
    .from(events)
    .leftJoin(event_categories, eq(events.category_id, event_categories.id))
    .orderBy(desc(events.start_time))
    .limit(20);

  return rows;
}

export default async function PublicEventsPage() {
  const session = await getServerSession();
  const allEvents = await getPublicEvents();

  const now = new Date();
  const upcoming = allEvents.filter((e) => new Date(e.start_time) > now);
  const past = allEvents.filter((e) => new Date(e.start_time) <= now);

  return (
    <div className="relative mx-auto w-full">
      <NavbarSection session={session} />

      <main className="mx-auto max-w-5xl px-5 pt-28 pb-20 sm:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Events
        </h1>
        <p className="mt-2 text-base text-slate-500 dark:text-slate-400">
          Event, workshop, dan meetup dari komunitas PurwokertoDev.
        </p>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-sky-500 uppercase">
              Upcoming
            </h2>
            <div className="space-y-4">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} isUpcoming />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
              Past Events
            </h2>
            <div className="space-y-4">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allEvents.length === 0 && (
          <div className="mt-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Calendar size={28} className="text-slate-400" variant="Bulk" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Belum ada event
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400">
              Pantau terus halaman ini untuk info event dari PurwokertoDev.
            </p>
          </div>
        )}
      </main>

      <FooterSection />
    </div>
  );
}

function EventCard({
  event,
  isUpcoming,
}: {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    location_name: string;
    start_time: Date;
    event_type: string;
    image: string | null;
    category_name: string | null;
  };
  isUpcoming?: boolean;
}) {
  const date = new Date(event.start_time);
  const day = date.getDate();
  const month = date.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
  const time = date.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <Link href={`/events/${event.slug}`} className="block">
      <div
        className={`group flex gap-4 rounded-xl border bg-white p-4 transition-all hover:shadow-md sm:gap-5 sm:p-5 dark:bg-slate-900/80 ${
          isUpcoming
            ? 'border-sky-200/60 dark:border-sky-900/40'
            : 'border-slate-200/80 dark:border-slate-800'
        }`}
      >
      {/* Date block */}
      <div
        className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl sm:h-18 sm:w-18 ${
          isUpcoming
            ? 'bg-sky-50 dark:bg-sky-950/30'
            : 'bg-slate-50 dark:bg-slate-800'
        }`}
      >
        <span className="text-xl font-bold leading-none text-slate-900 sm:text-2xl dark:text-white">
          {day}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-slate-400">
          {month}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            {event.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
              event.event_type === 'online'
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400'
                : 'bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400'
            }`}
          >
            {event.event_type}
          </span>
          {event.category_name && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {event.category_name}
            </span>
          )}
        </div>
        {event.description && (
          <p className="mt-1 line-clamp-1 text-sm text-slate-400 dark:text-slate-500">
            {event.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1">
            <Timer1 size={13} className="text-sky-500" variant="Bulk" />
            {time}
          </span>
          <span className="flex items-center gap-1">
            <Location size={13} className="text-sky-500" variant="Bulk" />
            {event.location_name}
          </span>
        </div>
      </div>

      {/* Image thumbnail */}
      {event.image && (
        <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:block">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        </div>
      )}
      </div>
    </Link>
  );
}
