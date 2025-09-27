"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { navItems } from "@/constants";
import { useState } from "react";
import { ThemeMode } from "./button-mode";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

export default function NavbarSection() {
 

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2" style={{ position: "relative", zIndex: 50 }}>
            <AnimatedThemeToggler />
            
            <Link href="/login" className={cn(buttonVariants({}),"px-5 bg-gradient-to-r from-sky-500 via-blue-500 to-blue-600 text-white hover:scale-105 transition-transform rounded-full duration-200")}>Login</Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex justify-center items-center gap-4">
                          <ThemeMode />

            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
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
            <div className="flex w-full  gap-4">

              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:scale-105 transition-transform"
              >
                Login
              </NavbarButton>
          
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
  );
}

