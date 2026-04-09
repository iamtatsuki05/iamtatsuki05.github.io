"use client";
import Link from 'next/link';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { NavLinks } from '@/components/site/NavLinks';
import { resolveNavItems } from '@/components/site/navItems';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { localeToRouteLocale } from '@/lib/i18n';
import { MobileMenu } from '@/components/site/MobileMenu';

export function Header() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const locale = extractLocaleFromPath(pathname) || 'ja';
  const localePrefix = `/${localeToRouteLocale(locale)}`;
  const activePath = pathname;

  const navItems = useMemo(() => resolveNavItems(locale), [locale]);

  return (
    <header className="sticky top-0 z-40 border-b border-purple-100/70 bg-gradient-to-r from-[#f8f5ff]/85 via-[#fff6e6]/90 to-[#f4eeff]/85 backdrop-blur-sm shadow-sm dark:border-purple-500/40 dark:from-[#120d1f]/90 dark:via-[#0f0a17]/90 dark:to-[#140f24]/88">
      <div className="container mx-auto max-w-screen-2xl px-4 py-4 flex items-center justify-between">
        <Link
          href={localizedPath('/', locale)}
          className="font-semibold text-lg bg-gradient-to-r from-purple-400 via-amber-300 to-purple-500 bg-clip-text text-transparent dark:from-purple-300 dark:via-amber-200 dark:to-purple-200"
        >
          Tatsuki Okada - Personal Site
        </Link>
        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-4">
          <NavLinks items={navItems} activePath={activePath} localePrefix={localePrefix} />
          <LanguageSwitch />
          <ThemeToggle />
        </nav>

        {/* Mobile buttons */}
        <div className="sm:hidden flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          <button
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="mobile-menu-trigger flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/75 text-gray-700 shadow-[0_18px_36px_-28px_rgba(192,132,252,0.9)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-white/90 dark:border-white/10 dark:bg-[#171022]/80 dark:text-gray-100 dark:hover:border-amber-200/30 dark:hover:bg-[#1d1630]/88 focus-ring"
          >
            <span aria-hidden="true" className="flex flex-col items-center gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={navItems}
        activePath={activePath}
        localePrefix={localePrefix}
      />
    </header>
  );
}
