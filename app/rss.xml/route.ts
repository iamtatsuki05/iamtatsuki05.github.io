import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/content/blog';

export const dynamic = 'force-static';

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const site =
    (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://iamtatsuki05.github.io');
  const posts = await getAllPosts();
  const items = posts
    .map((p) => {
      const link = `${site}/blogs/${p.slug}/`;
      const title = esc(p.title);
      const desc = esc(p.summary || '');
      const pubDate = new Date(p.date).toUTCString();
      return `\n    <item>\n      <title>${title}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${desc}</description>\n    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Personal Site Blog</title>\n    <link>${site}</link>\n    <description>Blog feed</description>\n    <language>ja</language>${items}\n  </channel>\n</rss>`;

  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
