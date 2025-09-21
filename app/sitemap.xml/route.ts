import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export const dynamic = 'force-static';

const STATIC_PATHS = ['/', '/ja/', '/en/', '/links/', '/publications/', '/blogs/'];

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const site = getSiteUrlWithBasePath();
  const staticEntries = STATIC_PATHS.map((path) => ({
    loc: `${site}${path}`,
    lastmod: new Date().toISOString(),
  }));

  const posts = await getAllPosts();
  const postEntries = posts.map((post) => ({
    loc: `${site}/blogs/${post.slug}/`,
    lastmod: new Date(post.updated || post.date).toISOString(),
  }));

  const urls = [...staticEntries, ...postEntries]
    .map((entry) => `<url><loc>${escapeXml(entry.loc)}</loc><lastmod>${entry.lastmod}</lastmod></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
