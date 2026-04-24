'use client';

import { useTheme } from 'next-themes';
import CountUp from '@/components/count-up';

const stats = [
  { label: 'Members', value: 100, suffix: '+' },
  { label: 'Events', value: 20, suffix: '+' },
  { label: 'Projects', value: 10, suffix: '+' },
  { label: 'Contributors', value: 30, suffix: '+' },
];

const techStack = [
  'React', 'Next.js', 'TypeScript', 'Node.js',
  'Go', 'Python', 'PostgreSQL', 'Docker',
  'Tailwind', 'Flutter', 'Laravel', 'Kubernetes',
];

const CommunitySection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="showcase"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full blur-[120px] ${
            isDark ? 'bg-emerald-950/20' : 'bg-emerald-100/40'
          }`}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-500">
            Community
          </span>
          <h2
            className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${
              isDark
                ? 'bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            Tumbuh Bersama Komunitas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Dari berbagai latar belakang teknologi, kami bersatu untuk belajar dan berkarya.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/60 p-6 text-center backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/50"
              style={{
                animationDelay: `${idx * 100}ms`,
                animationFillMode: 'both',
                animationDuration: '600ms',
              }}
            >
              <div className="text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
                <CountUp from={0} to={stat.value} duration={1.5} />
                <span className="text-sky-500">{stat.suffix}</span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <h3 className="mb-8 text-lg font-medium text-slate-500 dark:text-slate-400">
            Teknologi yang digunakan oleh anggota komunitas
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {techStack.map((tech, idx) => (
              <span
                key={tech}
                className="animate-in fade-in rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-sky-300 hover:text-sky-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:text-sky-400"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  animationFillMode: 'both',
                  animationDuration: '400ms',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
