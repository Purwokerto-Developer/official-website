import { db } from '@/db';
import { events, event_categories, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from '@/lib/better-auth/get-session';
import NavbarSection from '@/components/navbar';
import FooterSection from '@/components/landing/footer-section';
import { Calendar, Location, Timer1, ArrowLeft, Profile2User } from 'iconsax-reactjs';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const eventData = await db.query.events.findFirst({
    where: eq(events.slug, slug),
  });

  if (!eventData) {
    return {
      title: 'Event Not Found',
    };
  }

  return {
    title: `${eventData.title} — PurwokertoDev`,
    description: eventData.description || 'Detail event PurwokertoDev',
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getServerSession();

  const [eventData] = await db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      description: events.description,
      location_name: events.location_name,
      location_url: events.location_url,
      start_time: events.start_time,
      event_type: events.event_type,
      is_attendance_open: events.is_attendance_open,
      image: events.image,
      category_name: event_categories.name,
      collaborator_name: user.name,
    })
    .from(events)
    .leftJoin(event_categories, eq(events.category_id, event_categories.id))
    .leftJoin(user, eq(events.collaborator_id, user.id))
    .where(eq(events.slug, slug));

  if (!eventData) {
    notFound();
  }

  const date = new Date(eventData.start_time);
  const fullDate = date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = date.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  const isPast = date <= new Date();

  return (
    <div className="relative mx-auto w-full">
      <NavbarSection session={session} />

      <main className="mx-auto max-w-4xl px-5 pt-28 pb-20 sm:px-8">
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali ke Events
        </Link>

        {/* Hero Image */}
        {eventData.image ? (
          <div className="relative mb-10 overflow-hidden rounded-2xl bg-slate-100 pb-[50%] dark:bg-slate-800">
            <Image
              src={eventData.image}
              alt={eventData.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="mb-10 flex h-48 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
            <Calendar size={48} className="text-sky-500 opacity-50" variant="Bulk" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 text-zinc-600 dark:text-slate-300">
            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  eventData.event_type === 'online'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400'
                }`}
              >
                {eventData.event_type.toUpperCase()}
              </span>
              {eventData.category_name && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {eventData.category_name}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              {eventData.title}
            </h1>

            <div className="mt-8 prose prose-slate dark:prose-invert max-w-none">
              <h3 className="text-xl font-semibold mb-4 dark:text-white text-slate-900">Tentang Event Ini</h3>
              <p className="whitespace-pre-wrap leading-relaxed text-slate-600 dark:text-slate-300">
                {eventData.description || 'Tidak ada deskripsi untuk event ini.'}
              </p>
            </div>
          </div>

          {/* Sidebar / Info Card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
                Detail Pelaksanaan
              </h3>

              <div className="space-y-5 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex gap-3">
                  <Calendar size={20} className="shrink-0 text-sky-500" variant="Bulk" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Tanggal</p>
                    <p className="mt-0.5">{fullDate}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Timer1 size={20} className="shrink-0 text-sky-500" variant="Bulk" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Waktu</p>
                    <p className="mt-0.5">{time}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Location size={20} className="shrink-0 text-sky-500" variant="Bulk" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Lokasi</p>
                    <p className="mt-0.5">{eventData.location_name}</p>
                    {eventData.location_url && (
                      <a
                        href={eventData.location_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block text-sky-500 hover:underline"
                      >
                        Lihat Peta
                      </a>
                    )}
                  </div>
                </div>

                {eventData.collaborator_name && (
                  <div className="flex gap-3">
                    <Profile2User size={20} className="shrink-0 text-sky-500" variant="Bulk" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">Oleh</p>
                      <p className="mt-0.5">{eventData.collaborator_name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                {isPast ? (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  >
                    Event Telah Berlalu
                  </button>
                ) : eventData.is_attendance_open ? (
                  <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]">
                    Daftar Sekarang
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  >
                    Pendaftaran Ditutup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
