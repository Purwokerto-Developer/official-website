'use client';
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from '@/components/ui/resizable-navbar';
import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';
import { buttonVariants } from './ui/button';
import { Category2, Login } from 'iconsax-reactjs';
import { useSession } from '@/lib/better-auth/auth-client';
import { Session } from '@/types/better-auth';

export default function NavbarSection({ session }: { session?: Session }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 50 }}>
          <AnimatedThemeToggler />
          {!session ? (
            <Link
              href="/login"
              className={cn(
                buttonVariants({}),
                'rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-5 text-white transition-transform duration-200 hover:scale-105',
              )}
            >
              <Login size="32" className="text-white" variant="Bulk" /> Login
            </Link>
          ) : (
            <Link
              href="/u/dashboard"
              className={cn(
                buttonVariants({}),
                'rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-5 text-white transition-transform duration-200 hover:scale-105',
              )}
            >
              <Category2 size="32" className="text-white" variant="Bulk" /> Dashboard
            </Link>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center justify-center gap-4">
            <AnimatedThemeToggler />

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full gap-4">
            {!session ? (
              <Link
                href="/login"
                className={cn(
                  buttonVariants({}),
                  'rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-5 text-white transition-transform duration-200 hover:scale-105',
                )}
              >
                <Login size="32" className="text-white" variant="Bulk" /> Login
              </Link>
            ) : (
              <Link
                href="/u/dashboard"
                className={cn(
                  buttonVariants({}),
                  'rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 px-5 text-white transition-transform duration-200 hover:scale-105',
                )}
              >
                <Category2 size="32" className="text-white" variant="Bulk" /> Dashboard
              </Link>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
