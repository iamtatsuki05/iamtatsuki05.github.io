import type { APIRoute } from 'astro';
import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

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
  const staticPages: SitemapEntry[] = [
    ['/', 'weekly', 1],
    ['/ja-JP/', 'weekly', 0.9],
    ['/en-US/', 'weekly', 0.9],
    ['/links/', 'monthly', 0.8],
    ['/ja-JP/links/', 'monthly', 0.8],
    ['/en-US/links/', 'monthly', 0.8],
    ['/blogs/', 'weekly', 0.9],
    ['/ja-JP/blogs/', 'weekly', 0.9],
    ['/en-US/blogs/', 'weekly', 0.9],
    ['/hobbies/', 'monthly', 0.8],
    ['/ja-JP/hobbies/', 'monthly', 0.8],
    ['/en-US/hobbies/', 'monthly', 0.8],
    ['/publications/', 'monthly', 0.8],
    ['/ja-JP/publications/', 'monthly', 0.8],
    ['/en-US/publications/', 'monthly', 0.8],
  ].map(([path, changeFrequency, priority]) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: String(changeFrequency),
    priority: Number(priority),
  }));

  const posts = await getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${site}/blogs/${post.slug}/`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const urls = [...staticPages, ...blogPages]
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
