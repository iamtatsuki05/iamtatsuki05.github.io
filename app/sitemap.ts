import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { getAllPosts } from '@/lib/content/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site =
    (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://iamtatsuki05.github.io');

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${site}/`, lastModified: new Date() },
    { url: `${site}/ja/`, lastModified: new Date() },
    { url: `${site}/en/`, lastModified: new Date() },
    { url: `${site}/links/`, lastModified: new Date() },
    { url: `${site}/publications/`, lastModified: new Date() },
    { url: `${site}/blogs/`, lastModified: new Date() },
  ];

  const posts = await getAllPosts();
  const blogUrls: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site}/blogs/${p.slug}/`,
    lastModified: p.updated ?? p.date,
  }));

  return [...staticUrls, ...blogUrls];
}
