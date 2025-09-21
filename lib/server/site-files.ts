import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export type SitemapEntry = {
  url: string;
  lastModified?: string | Date;
};

const staticPaths = ['/', '/ja/', '/en/', '/links/', '/publications/', '/blogs/'] as const;

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const siteWithBase = getSiteUrlWithBasePath();
  const staticEntries: SitemapEntry[] = staticPaths.map((path) => ({
    url: `${siteWithBase}${path}`,
    lastModified: new Date(),
  }));

  const posts = await getAllPosts();
  const postEntries: SitemapEntry[] = posts.map((post) => ({
    url: `${siteWithBase}/blogs/${post.slug}/`,
    lastModified: post.updated ?? post.date,
  }));

  return [...staticEntries, ...postEntries];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function buildSitemapXml(): Promise<string> {
  const entries = await getSitemapEntries();
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`
        : '';
      return `<url><loc>${escapeXml(entry.url)}</loc>${lastmod}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

export async function buildRobotsTxt(): Promise<string> {
  const siteWithBase = getSiteUrlWithBasePath();
  return `User-agent: *\nAllow: /\nSitemap: ${siteWithBase}/sitemap.xml\n`;
}

export async function buildRssXml(): Promise<string> {
  const siteWithBase = getSiteUrlWithBasePath();
  const posts = await getAllPosts();
  const items = posts
    .map((post) => {
      const link = `${siteWithBase}/blogs/${post.slug}/`;
      const title = escapeXml(post.title);
      const description = escapeXml(post.summary || '');
      const pubDate = new Date(post.date).toUTCString();
      return `\n    <item>\n      <title>${title}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${description}</description>\n    </item>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Personal Site Blog</title>\n    <link>${siteWithBase}</link>\n    <description>Blog feed</description>\n    <language>ja</language>${items}\n  </channel>\n</rss>`;
}
