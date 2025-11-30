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
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-5xl px-4 py-8 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">Tatsuki Okada</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              NLP / LLM Engineer. Sharing projects, writings, and publications.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto sm:justify-end">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localizedPath(link.href, locale)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow md:px-4 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
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
