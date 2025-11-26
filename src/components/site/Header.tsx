"use client";
import Link from 'next/link';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavLinks } from '@/components/site/NavLinks';
import { resolveNavItems } from '@/components/site/navItems';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { MobileMenu } from '@/components/site/MobileMenu';

export function Header() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const locale = extractLocaleFromPath(pathname) || 'ja';
  const localePrefix = locale === 'ja' ? '/ja' : '/en';
  const activePath = pathname;

  // メニュー表示中はスクロールを固定
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.body;
    if (open) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
    return () => {
      root.style.overflow = '';
    };
  }, [open]);

  const navItems = resolveNavItems(locale);

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <Link href={localizedPath('/', locale)} className="font-semibold text-lg">Tatsuki Okada - Personal Site</Link>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-4">
          <NavLinks items={navItems} activePath={activePath} localePrefix={localePrefix} />
          <LanguageSwitch />
          <ThemeToggle />
        </div>

        {/* Mobile buttons */}
        <div className="sm:hidden flex items-center gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          <button
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
          className="px-2 py-1 rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors focus-ring"
          >
            {/* Hamburger icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
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
