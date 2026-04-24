import Image from 'next/image';
import Link from 'next/link';

const footerLinks = {
  Komunitas: [
    { label: 'Events', href: '#events' },
    { label: 'Members', href: '#showcase' },
    { label: 'Blog', href: '#blog' },
    { label: 'Open Source', href: 'https://github.com/Purwokerto-Developer' },
  ],
  Resources: [
    { label: 'Dashboard', href: '/u/dashboard' },
    { label: 'Articles', href: '/u/articles' },
    { label: 'API Docs', href: '/api-doc' },
  ],
  Social: [
    { label: 'GitHub', href: 'https://github.com/Purwokerto-Developer' },
    { label: 'Instagram', href: 'https://instagram.com/purwokertodev' },
    { label: 'Discord', href: '#' },
  ],
};

const FooterSection = () => {
  return (
    <footer className="relative border-t border-slate-200/60 bg-slate-50/50 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800/60 dark:bg-slate-950/50">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/img-logo.png"
                alt="PurwokertoDev"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                PurwokertoDev
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Wadah Komunitas Developer Purwokerto untuk Berkreasi, Terkoneksi, dan Berkolaborasi.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/60 pt-8 sm:flex-row dark:border-slate-800/60">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} PurwokertoDev. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Made with ❤️ in Purwokerto
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
