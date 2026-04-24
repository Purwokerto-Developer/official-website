'use client';

import { useTheme } from 'next-themes';
import { People, Calendar, Code1 } from 'iconsax-reactjs';

const features = [
  {
    icon: People,
    title: 'Komunitas Developer',
    description:
      'Bergabung dengan developer dari berbagai latar belakang di Purwokerto. Saling belajar, berbagi pengalaman, dan tumbuh bersama.',
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    icon: Calendar,
    title: 'Events & Meetup',
    description:
      'Workshop, seminar, dan meetup rutin yang membahas teknologi terkini. Dari frontend hingga cloud infrastructure.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Code1,
    title: 'Open Source',
    description:
      'Berkontribusi dalam proyek-proyek open source bersama. Tingkatkan skill coding sambil membangun portofolio nyata.',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

const AboutSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] ${
            isDark ? 'bg-blue-950/30' : 'bg-blue-100/60'
          }`}
        />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-sm font-medium text-sky-500">
            Tentang Kami
          </span>
          <h2
            className={`mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${
              isDark
                ? 'bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}
          >
            Wadah Developer Purwokerto
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Kami percaya bahwa teknologi tumbuh lebih baik saat dikembangkan bersama.
            PurwokertoDev adalah rumah bagi para developer yang ingin berkreasi dan berkolaborasi.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="animate-in fade-in slide-in-from-bottom-4 group relative rounded-2xl border border-slate-200/60 bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-900/50"
              style={{
                animationDelay: `${idx * 150}ms`,
                animationFillMode: 'both',
                animationDuration: '600ms',
              }}
            >
              {/* Icon */}
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
              >
                <feature.icon size={28} className="text-white" variant="Bulk" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
