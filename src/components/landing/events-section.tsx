'use client';

import { useTheme } from 'next-themes';
import { Calendar, Location, ArrowRight2, Timer1 } from 'iconsax-reactjs';
import Link from 'next/link';
import Image from 'next/image';

type EventItem = {
  id: string | number;
  title: string;
  date: string;
  status: 'online' | 'offline' | string;
  eventStatus: string;
  registered: boolean;
  location: string;
  image?: string | null;
  description?: string | null;
};

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('id-ID', { month: 'short' }).toUpperCase();
  return { day, month };
}

const EventsSection = ({ events }: { events: EventItem[] }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const hasEvents = events.length > 0;

  return (
    <section id="events" className="relative w-full px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Header — aligned left, not centered */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
              Events
            </p>
            <h2 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Yang akan datang
            </h2>
          </div>
          <Link
            href="/u/events"
            className="group flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-sky-500 dark:text-slate-400"
          >
            Lihat semua event
            <ArrowRight2
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {hasEvents ? (
          <>
            {/* Featured event — first card large */}
            {events.length > 0 && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200/80 transition-shadow hover:shadow-lg dark:border-slate-800">
                <div className="flex flex-col md:flex-row">
                  {/* Image side */}
                  <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-sky-100 to-violet-100 md:aspect-auto md:w-[45%] dark:from-sky-950/40 dark:to-violet-950/40">
                    {events[0].image ? (
                      <Image
                        src={events[0].image}
                        alt={events[0].title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[200px] w-full items-center justify-center">
                        <Calendar size={48} className="text-sky-300/50 dark:text-sky-700/50" variant="Bulk" />
                      </div>
                    )}
                  </div>
                  {/* Content side */}
                  <div className="flex flex-1 flex-col justify-center bg-white p-6 sm:p-8 dark:bg-slate-900/80">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                        {events[0].status}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">{events[0].eventStatus}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                      {events[0].title}
                    </h3>
                    {events[0].description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {events[0].description}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Timer1 size={16} className="text-sky-500" variant="Bulk" />
                        {events[0].date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Location size={16} className="text-sky-500" variant="Bulk" />
                        {events[0].location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining events — compact list */}
            {events.length > 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.slice(1, 7).map((event) => {
                  const { day, month } = formatEventDate(event.date);
                  return (
                    <div
                      key={event.id}
                      className="group flex gap-4 rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
                    >
                      {/* Date block */}
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                        <span className="text-lg font-bold leading-none text-slate-900 dark:text-white">
                          {day}
                        </span>
                        <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-slate-400">
                          {month}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                          {event.title}
                        </h4>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <Location size={12} variant="Bulk" className="shrink-0 text-sky-500" />
                          <span className="truncate">{event.location}</span>
                        </p>
                        <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          {event.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          /* Empty state — minimal, not overly designed */
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/20">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <Calendar size={28} className="text-slate-400" variant="Bulk" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Belum ada event mendatang
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-400 dark:text-slate-500">
              Pantau terus halaman ini — event berikutnya dari PurwokertoDev bisa datang kapan saja.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
