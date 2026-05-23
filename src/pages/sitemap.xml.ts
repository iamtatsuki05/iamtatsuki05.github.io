import type { APIRoute } from 'astro';
import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';
import { SUPPORTED_ROUTE_LOCALES, resolveLocale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
};

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = async () => {
  const site = getSiteUrlWithBasePath();
  const now = new Date();
  const topLevelPages = ['/', '/links/', '/blogs/', '/hobbies/', '/publications/'];
  const localizedStaticPages = SUPPORTED_ROUTE_LOCALES.flatMap((routeLocale) => {
    const locale = resolveLocale(routeLocale);
    return topLevelPages.map((pagePath): SitemapEntry => ({
      url: `${site}${localizedPath(pagePath, locale)}`,
      lastModified: now,
      changeFrequency: pagePath === '/blogs/' || pagePath === '/' ? 'weekly' : 'monthly',
      priority: pagePath === '/' ? 0.9 : 0.8,
    }));
  });
  const staticPages: SitemapEntry[] = [
    ['/', 'weekly', 1],
    ['/links/', 'monthly', 0.8],
    ['/blogs/', 'weekly', 0.9],
    ['/hobbies/', 'monthly', 0.8],
    ['/publications/', 'monthly', 0.8],
  ].map(([path, changeFrequency, priority]) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: String(changeFrequency),
    priority: Number(priority),
  }));

  const jaPosts = await getAllPosts();
  const defaultBlogPages = jaPosts.map((post) => ({
    url: `${site}/blogs/${post.slug}/`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  const localizedBlogPages = (
    await Promise.all(
      SUPPORTED_ROUTE_LOCALES.map(async (routeLocale) => {
        const locale = resolveLocale(routeLocale);
        const posts = await getAllPosts(locale);
        return posts.map((post) => ({
          url: `${site}/${routeLocale}/blogs/${post.slug}/`,
          lastModified: new Date(post.updated || post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
        }));
      }),
    )
  ).flat();

  const urls = [...staticPages, ...localizedStaticPages, ...defaultBlogPages, ...localizedBlogPages]
    .map((entry) => {
      const lastmod = Number.isNaN(entry.lastModified.getTime()) ? now : entry.lastModified;
      return [
        '<url>',
        `<loc>${escapeXml(entry.url)}</loc>`,
        `<lastmod>${lastmod.toISOString()}</lastmod>`,
        `<changefreq>${entry.changeFrequency}</changefreq>`,
        `<priority>${entry.priority}</priority>`,
        '</url>',
      ].join('');
    })
    .join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
