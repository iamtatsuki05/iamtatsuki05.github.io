import Link from 'next/link';
import { absoluteUrl } from '@/lib/seo';

export function Footer() {
  const sitemapHref = absoluteUrl('/sitemap.xml');
  const rssHref = absoluteUrl('/rss.xml');
  const robotsHref = absoluteUrl('/robots.txt');

  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600 dark:text-gray-400">
        <nav aria-label="Footer navigation" className="mb-4">
          <ul className="flex flex-wrap gap-4">
            <li>
              <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/links/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Links
              </Link>
            </li>
            <li>
              <Link href="/blogs/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/publications/" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                Publications
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-2">
          <p>&copy; {new Date().getFullYear()} Tatsuki Okada - Personal Site</p>
          <p>
            <a href={sitemapHref} className="mr-3 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Sitemap</a>
            <a href={rssHref} className="mr-3 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">RSS</a>
            <a href={robotsHref} className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Robots</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
