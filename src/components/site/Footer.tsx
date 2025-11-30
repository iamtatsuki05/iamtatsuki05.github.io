"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { absoluteUrl } from '@/lib/seo';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { resolveNavItems } from '@/components/site/navItems';

export function Footer() {
  const pathname = usePathname() || '';
  const locale = extractLocaleFromPath(pathname) || 'ja';
  const navLinks = resolveNavItems(locale);
  const sitemapHref = absoluteUrl('/sitemap.xml');
  const rssHref = absoluteUrl('/rss.xml');
  const robotsHref = absoluteUrl('/robots.txt');
  const resourceLinks = [
    { href: sitemapHref, label: 'Sitemap' },
    { href: rssHref, label: 'RSS' },
    { href: robotsHref, label: 'Robots' },
  ];

  return (
    <footer className="mt-12 border-t border-purple-100/70 bg-gradient-to-r from-[#f8f5ff] via-[#fff6e6] to-[#f4eeff] dark:border-purple-500/40 dark:from-[#0b101a] dark:via-[#120d21] dark:to-[#0b101a]">
      <div className="container mx-auto max-w-5xl px-4 py-8 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold bg-gradient-to-r from-purple-400 via-amber-300 to-purple-500 bg-clip-text text-transparent dark:from-purple-300 dark:via-amber-200 dark:to-purple-200">
              Tatsuki Okada
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              NLP / LLM Engineer. Sharing projects, writings, and publications.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedPath(link.href, locale)}
                className="rounded-full border border-purple-200/70 bg-white/85 px-3 py-1 text-sm text-gray-900 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 md:px-4 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30 dark:hover:shadow-amber-700/30"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex w-full flex-wrap gap-3 text-xs sm:w-auto sm:flex-col sm:items-end sm:text-right">
            {resourceLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Tatsuki Okada</span>
        </div>
      </div>
    </footer>
  );
}
