'use client';

import { useTheme } from 'next-themes';
import { People, Calendar, Code1, ArrowRight2 } from 'iconsax-reactjs';
import Link from 'next/link';

const AboutSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section id="about" className="relative w-full px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Two-column layout — text left, bento grid right */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
          {/* Left — sticky intro text */}
          <div className="shrink-0 lg:sticky lg:top-28 lg:w-[380px]">
            <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
              Tentang Kami
            </p>
            <h2 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Bukan sekadar
              <br />
              <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                komunitas biasa.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-500 dark:text-slate-400">
              PurwokertoDev lahir dari kebutuhan sederhana — tempat bertukar pikiran antar developer
              di Purwokerto. Sekarang kami tumbuh jadi wadah untuk belajar, membangun proyek nyata,
              dan saling support.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-500 transition-colors hover:text-sky-400"
            >
              Gabung sekarang
              <ArrowRight2 size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right — Bento-style cards */}
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Card 1 — tall */}
            <div className="row-span-2 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-b from-sky-50 to-white p-6 sm:p-8 dark:border-slate-800 dark:from-sky-950/30 dark:to-slate-900/80">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10">
                  <People size={24} className="text-sky-500" variant="Bulk" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Komunitas Developer
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Developer frontend, backend, mobile, DevOps — semua ada di sini. Dari yang baru
                  mulai sampai yang sudah senior, kita belajar bareng tanpa pressure.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'].map(
                    (bg, i) => (
                      <div
                        key={i}
                        className={`h-8 w-8 rounded-full border-2 border-white ${bg} dark:border-slate-900`}
                      />
                    ),
                  )}
                </div>
                <span className="text-xs text-slate-400">100+ members</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-violet-50 to-white p-6 dark:border-slate-800 dark:from-violet-950/20 dark:to-slate-900/80">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10">
                <Calendar size={20} className="text-violet-500" variant="Bulk" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Events & Meetup</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Workshop hands-on, tech talk, dan meetup santai. Offline di Purwokerto, online buat
                yang jauh.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-white p-6 dark:border-slate-800 dark:from-emerald-950/20 dark:to-slate-900/80">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Code1 size={20} className="text-emerald-500" variant="Bulk" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Open Source</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Bangun proyek bareng, kontribusi ke repo komunitas, dan bangun portofolio yang
                nyata.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
