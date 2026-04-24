'use client';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Login, ArrowDown2 } from 'iconsax-reactjs';
import { Highlighter } from '../ui/highlighter';

const DotGrid = dynamic(() => import('@/components/dot-grid'), { ssr: false, loading: () => null });

const HeroSection = () => {
  const { resolvedTheme } = useTheme();

  const baseColor = resolvedTheme === 'dark' ? '#1F2038' : '#F1F5F9';
  const activeColor = resolvedTheme === 'dark' ? '#2930FF' : '#74d4ff';

  const textGradientClass =
    resolvedTheme === 'dark'
      ? 'bg-gradient-to-b from-white to-slate-500'
      : 'bg-gradient-to-b from-blue-300 to-blue-700';

  return (
    <section
      id="hero"
      className="relative z-0 flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: '100vw', height: '100vh' }}
        />
        <div className="hero-radial-gradient" />
      </div>

      {/* Content — vertically centered */}
      <div className="z-10 flex w-full flex-col items-center justify-center gap-5 px-5 sm:gap-6">
        {/* Badge */}
        <div className="w-fit rounded-full border bg-gradient-to-tr from-slate-200/80 to-slate-100/80 px-3 py-1.5 text-center text-xs font-medium text-slate-700 backdrop-blur-lg sm:px-4 sm:py-2 sm:text-sm dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-700/80 dark:text-slate-300">
          <span className="from-primary mr-2 rounded-full bg-gradient-to-b to-blue-700 px-1.5 py-0.5 text-[10px] text-white sm:mr-3 sm:px-2 sm:py-1 sm:text-xs">
            Hello 🎉
          </span>
          Welcome to the community
        </div>

        {/* Title — much bigger on mobile */}
        <h1
          className={cn(
            'relative z-10 bg-clip-text text-center font-sans font-bold text-transparent capitalize',
            'text-[3.2rem] leading-[0.9] sm:text-7xl md:text-8xl lg:text-[150px]',
            textGradientClass,
          )}
        >
          Purwokerto<span className="font-light">Dev</span>
        </h1>

        {/* Description */}
        <p className="relative mx-auto max-w-xs text-center text-sm leading-relaxed text-slate-500 sm:max-w-md sm:text-base md:max-w-xl lg:text-lg dark:text-slate-300">
          Komunitas{' '}
          <Highlighter action="underline" color="#FF9800">
            Developer Purwokerto
          </Highlighter>
          . Wadah untuk Berkreasi, Terkoneksi, dan Berkolaborasi.
        </p>

        {/* CTA Buttons */}
        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl active:scale-[0.98]"
          >
            <Login size={18} variant="Bulk" />
            Bergabung Sekarang
          </Link>
          <a
            href="#about"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all hover:border-slate-400 hover:bg-white/50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50"
          >
            Pelajari Lebih
            <ArrowDown2 size={14} />
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-slate-300/50 pt-1.5 dark:border-slate-600/50">
          <div className="h-1.5 w-1 animate-bounce rounded-full bg-slate-400/60 dark:bg-slate-500/60" />
        </div>
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(HeroSection), { ssr: false });
