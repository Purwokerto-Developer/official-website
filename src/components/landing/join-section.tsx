'use client';

import Link from 'next/link';
import { Login, ArrowRight2 } from 'iconsax-reactjs';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const JoinSection = () => {
  return (
    <section
      id="join"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-violet-600 p-12 text-center shadow-2xl sm:p-16">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-32 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300/10 blur-2xl" />

          <div className="relative z-10">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              🎉 Open for Everyone
            </span>

            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Bergabung dengan
              <br />
              PurwokertoDev
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-lg text-blue-100/90">
              Tidak peduli kamu pemula atau expert — semua developer Purwokerto punya tempat di sini.
              Mulai perjalananmu hari ini.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'rounded-full bg-white px-8 text-base font-semibold text-blue-600 shadow-lg transition-all hover:scale-105 hover:bg-blue-50 hover:shadow-xl',
                )}
              >
                <Login size={20} className="mr-2" variant="Bulk" />
                Daftar Sekarang
              </Link>
              <Link
                href="https://github.com/Purwokerto-Developer"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                GitHub Organization
                <ArrowRight2
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
