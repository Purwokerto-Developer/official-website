import Image from 'next/image';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Komunitas',
    links: [
      { label: 'Events', href: '#events' },
      { label: 'Members', href: '#showcase' },
      { label: 'Open Source', href: 'https://github.com/Purwokerto-Developer' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', href: '/u/dashboard' },
      { label: 'Articles', href: '/u/articles' },
      { label: 'Login', href: '/login' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'GitHub', href: 'https://github.com/Purwokerto-Developer' },
      { label: 'Instagram', href: 'https://instagram.com/purwokertodev' },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="border-t border-slate-200/60 px-5 pt-12 pb-8 sm:px-8 dark:border-slate-800/40">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Image
                src="/img-logo.png"
                alt="PurwokertoDev"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                PurwokertoDev
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400 dark:text-slate-500">
              Wadah Developer Purwokerto untuk Berkreasi, Terkoneksi, dan Berkolaborasi.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 sm:gap-16">
            {footerLinks.map((col) => (
              <div key={col.title}>
                <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-slate-200/60 pt-6 sm:flex-row dark:border-slate-800/40">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} PurwokertoDev
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Made with ❤️ in Purwokerto
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
