'use client';

import Link from 'next/link';
import { Login, ArrowRight2 } from 'iconsax-reactjs';

const JoinSection = () => {
  return (
    <section id="join" className="relative w-full px-5 pt-8 pb-20 sm:px-8 md:pt-12 md:pb-28">
      <div className="mx-auto max-w-6xl">
        {/* Split layout: text left, visual right */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-800/60">
          <div className="flex flex-col lg:flex-row">
            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:w-[55%]">
              <h2 className="text-3xl leading-tight font-bold text-white sm:text-4xl">
                Siap jadi bagian
                <br />
                dari cerita ini?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
                Tidak peduli tech stack-mu apa, level-mu di mana — semua developer Purwokerto
                punya tempat di sini. Gratis, tanpa syarat.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 active:scale-[0.98]"
                >
                  <Login size={18} variant="Bulk" />
                  Daftar Sekarang
                </Link>
                <Link
                  href="https://github.com/Purwokerto-Developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-600 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-500 hover:text-white"
                >
                  GitHub
                  <ArrowRight2
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Visual side — abstract grid pattern */}
            <div className="relative hidden lg:block lg:w-[45%]">
              <div className="absolute inset-0 bg-gradient-to-l from-sky-500/10 to-transparent" />
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-2 p-6 opacity-30">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg"
                    style={{
                      background:
                        i % 5 === 0
                          ? 'linear-gradient(135deg, #38bdf8, #818cf8)'
                          : i % 3 === 0
                            ? 'rgba(56,189,248,0.15)'
                            : 'rgba(100,116,139,0.08)',
                    }}
                  />
                ))}
              </div>
              {/* Gradient orb */}
              <div className="absolute top-1/2 right-12 h-48 w-48 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-500/20 to-violet-500/20 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
