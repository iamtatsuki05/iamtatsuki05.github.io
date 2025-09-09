"use client";
import Link from 'next/link';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const nav = [
  { href: '/', label: '🏠 Home' },
  { href: '/links/', label: '🔗 Links' },
  { href: '/publications/', label: '📚 Publications' },
  { href: '/blogs/', label: '📝 Blog' },
];

export function Header() {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const localePrefix = pathname.startsWith('/ja') ? '/ja' : pathname.startsWith('/en') ? '/en' : '';
  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">Tatsuki Okada - Personal Site</Link>
        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={`${localePrefix}${n.href}`}
              className={clsx(
                'px-2 py-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                pathname === `${localePrefix}${n.href}` && 'bg-gray-100 dark:bg-gray-800',
              )}
            >
              {n.label}
            </Link>
          ))}
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
            className="px-2 py-1 rounded-sm border border-gray-200 dark:border-gray-700"
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

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="sm:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg p-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={`${localePrefix}${n.href}`}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'px-3 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800',
                    pathname === `${localePrefix}${n.href}` && 'bg-gray-100 dark:bg-gray-800',
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
