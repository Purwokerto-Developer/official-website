'use client';

import { useTheme } from 'next-themes';
import { Calendar, Location, ArrowRight2 } from 'iconsax-reactjs';
import { Badge } from '@/components/ui/badge';
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

const EventsSection = ({ events }: { events: EventItem[] }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const hasEvents = events.length > 0;

  return (
    <section id="events" className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      {/* Background accent */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute top-0 right-0 h-[500px] w-[500px] rounded-full blur-[140px] ${
            isDark ? 'bg-violet-950/20' : 'bg-violet-100/50'
          }`}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-500">
              Events
            </span>
            <h2
              className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl ${
                isDark
                  ? 'bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent'
                  : 'text-slate-900'
              }`}
            >
              Upcoming Events
            </h2>
            <p className="mt-2 max-w-lg text-slate-500 dark:text-slate-400">
              Jangan lewatkan event-event seru dari komunitas PurwokertoDev.
            </p>
          </div>
          <Link
            href="/u/events"
            className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-sky-300 hover:text-sky-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-400"
          >
            Lihat Semua
            <ArrowRight2
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Events Grid */}
        {hasEvents ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event, idx) => (
              <div
                key={event.id}
                className="animate-in fade-in slide-in-from-bottom-4 group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: 'both',
                  animationDuration: '600ms',
                }}
              >
                {/* Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-sky-100 to-violet-100 dark:from-sky-900/30 dark:to-violet-900/30">
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Calendar
                        size={40}
                        className="text-sky-400/60 dark:text-sky-500/40"
                        variant="Bulk"
                      />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={event.status === 'online' ? 'default' : 'secondary'}
                      className="backdrop-blur-sm"
                    >
                      {event.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} variant="Bulk" className="text-sky-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Location size={16} variant="Bulk" className="text-sky-500" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-400 dark:text-slate-500">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center dark:border-slate-700 dark:bg-slate-900/30">
            <div className="absolute inset-0 -z-10">
              <div
                className={`absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] ${
                  isDark ? 'bg-violet-950/20' : 'bg-violet-100/40'
                }`}
              />
            </div>
            <Calendar
              size={56}
              className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
              variant="Bulk"
            />
            <h3 className="mb-2 text-xl font-semibold text-slate-600 dark:text-slate-400">
              Belum ada event mendatang
            </h3>
            <p className="mx-auto max-w-md text-slate-400 dark:text-slate-500">
              Tetap pantau halaman ini untuk info event selanjutnya dari komunitas PurwokertoDev!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
