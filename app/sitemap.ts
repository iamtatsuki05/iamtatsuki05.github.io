import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/lib/server/site-files';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified ? new Date(entry.lastModified) : new Date(),
  }));
}
