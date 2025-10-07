'use client';
import DotGrid from '@/components/dot-grid';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const HeroSection = () => {
  const { resolvedTheme } = useTheme();

  const baseColor = resolvedTheme === 'dark' ? '#1F2038' : '#F1F5F9';
  const activeColor = resolvedTheme === 'dark' ? '#2930FF' : '#74d4ff';

  const textGradientClass =
    resolvedTheme === 'dark'
      ? 'bg-gradient-to-b from-white to-slate-500'
      : 'bg-gradient-to-b from-blue-200 to-blue-700';

  return (
    <section
      id="hero"
      className="relative z-0 flex min-h-screen w-full flex-col items-start justify-start overflow-hidden"
    >
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

      <div className="z-10 mt-60 flex w-full flex-col items-center justify-center gap-4">
        <div className="w-fit cursor-pointer rounded-full border bg-gradient-to-tr from-slate-200/80 to-slate-100/80 px-2 py-3 text-center font-medium text-slate-800 opacity-80 backdrop-blur-lg transition-all duration-200 hover:scale-105 dark:bg-gradient-to-b dark:from-slate-900/80 dark:to-slate-700/80 dark:text-slate-300">
          <span className="from-primary mr-4 rounded-full bg-gradient-to-b to-blue-700 p-2 text-sm text-white">
            Hello 🎉
          </span>
          Welcome to the community
        </div>

        <h1
          className={cn(
            `relative z-10 bg-clip-text text-center font-sans text-lg font-bold text-transparent capitalize md:text-7xl lg:text-[150px]`,
            textGradientClass,
          )}
        >
          Purwokerto<span className="font-light">Dev</span>
        </h1>

        <p className="relative mx-auto mt-4 max-w-xl text-center text-xl text-slate-400 dark:text-white">
          Komunitas Developer Purwokerto. Wadah Komunitas Developer Purwokerto untuk Berkreasi,
          Terkoneksi, dan Berkolaborasi.
        </p>
      </div>
    </section>
  );
};

export default dynamic(() => Promise.resolve(HeroSection), { ssr: false });
