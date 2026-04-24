'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { label: 'Members', value: 100, suffix: '+' },
  { label: 'Events Held', value: 20, suffix: '+' },
  { label: 'Projects', value: 10, suffix: '+' },
  { label: 'Contributors', value: 30, suffix: '+' },
];

const techStack = [
  { name: 'React', color: 'text-sky-500' },
  { name: 'Next.js', color: 'text-slate-900 dark:text-white' },
  { name: 'TypeScript', color: 'text-blue-500' },
  { name: 'Node.js', color: 'text-emerald-500' },
  { name: 'Go', color: 'text-cyan-500' },
  { name: 'Python', color: 'text-yellow-500' },
  { name: 'PostgreSQL', color: 'text-blue-400' },
  { name: 'Docker', color: 'text-sky-400' },
  { name: 'Flutter', color: 'text-cyan-400' },
  { name: 'Laravel', color: 'text-red-400' },
  { name: 'Vue', color: 'text-emerald-400' },
  { name: 'Tailwind', color: 'text-teal-400' },
];

// Inline counter — no external dependency needed
function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

const CommunitySection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="showcase"
      className="relative w-full px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28"
    >
      <div className="mx-auto max-w-6xl">
        {/* Stats row — horizontal marquee-style on mobile, grid on desktop */}
        <div className="mb-16">
          <p className="text-primary mb-2 text-sm font-semibold tracking-widest uppercase">
            Komunitas
          </p>
          <h2 className="text-3xl leading-tight font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Angka bicara.
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl dark:text-white">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="mt-1 text-xs font-medium tracking-wide text-slate-400 uppercase sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack — scrolling tags, visually interesting */}
        <div>
          <h3 className="mb-6 text-sm font-medium text-slate-400 dark:text-slate-500">
            Teknologi yang digunakan anggota kami →
          </h3>

          {/* Horizontal scroll on mobile, wrap on desktop */}
          <div className="hide-scrollbar -mx-5 flex gap-2.5 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="shrink-0 cursor-default rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-200 select-none hover:border-slate-300 hover:shadow-sm dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600"
              >
                <span className={tech.color}>●</span>{' '}
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
