"use client";
import { useEffect, useState } from 'react';
import { withBasePath } from '@/lib/url';

export function Footer() {
  const [sitemapHref, setSitemapHref] = useState(withBasePath('/sitemap.xml')!);
  const [rssHref, setRssHref] = useState(withBasePath('/rss.xml')!);
  const [robotsHref, setRobotsHref] = useState(withBasePath('/robots.txt')!);

  useEffect(() => {
    try {
      const base = window.location.href;
      setSitemapHref(new URL(withBasePath('/sitemap.xml')!, base).toString());
      setRssHref(new URL(withBasePath('/rss.xml')!, base).toString());
      setRobotsHref(new URL(withBasePath('/robots.txt')!, base).toString());
    } catch {
      // noop: keep SSR fallback
    }
  }, []);

  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-2">
        <p>&copy; {new Date().getFullYear()} Tatsuki Okada - Personal Site</p>
        <p>
          <a href={sitemapHref} className="mr-3">Sitemap</a>
          <a href={rssHref} className="mr-3">RSS</a>
          <a href={robotsHref}>Robots</a>
        </p>
      </div>
    </footer>
  );
}
