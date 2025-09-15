import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { getAllPosts } from '@/lib/content/blog';
import { BASE_PATH } from '@/lib/url';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site =
    (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://iamtatsuki05.github.io');
  // basePath 対応（例: GitHub Pages の project pages）
  const trimmed = site.replace(/\/$/, '');
  const need = BASE_PATH || '';
  const originWithBase = need && !trimmed.endsWith(need) ? `${trimmed}${need}` : trimmed;

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${originWithBase}/`, lastModified: new Date() },
    { url: `${originWithBase}/ja/`, lastModified: new Date() },
    { url: `${originWithBase}/en/`, lastModified: new Date() },
    { url: `${originWithBase}/links/`, lastModified: new Date() },
    { url: `${originWithBase}/publications/`, lastModified: new Date() },
    { url: `${originWithBase}/blogs/`, lastModified: new Date() },
  ];

  const posts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${originWithBase}/blogs/${p.slug}/`,
    lastModified: p.updated ?? p.date,
  }));

  return [...staticUrls, ...blogUrls];
}
