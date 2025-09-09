#!/usr/bin/env bun
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { getAllPosts } from '../lib/content/blog';

const site = process.env.SITE_URL || 'https://iamtatsuki05.github.io';

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function generateSitemap() {
  const blogDir = path.join(process.cwd(), 'content', 'blogs');
  const files = await readdir(blogDir);
  const blogUrls = files
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
    .map((slug) => `${site}/blogs/${slug}/`);

  const staticUrls = [
    `${site}/`,
    `${site}/ja/`,
    `${site}/en/`,
    `${site}/links/`,
    `${site}/publications/`,
    `${site}/blogs/`,
  ];

  const urls = [...staticUrls, ...blogUrls]
    .map((loc) => `<url><loc>${loc}</loc></url>`)
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  const outPath = path.join(process.cwd(), 'out', 'sitemap.xml');
  await writeFile(outPath, xml);
  console.log('sitemap.xml generated');
}

async function generateRobots() {
  const robots = `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;
  await writeFile(path.join(process.cwd(), 'out', 'robots.txt'), robots);
  console.log('robots.txt generated');
}

async function generateRSS() {
  const posts = await getAllPosts();
  const items = posts
    .map((p) => {
      const link = `${site}/blogs/${p.slug}/`;
      const title = escapeXml(p.title);
      const desc = escapeXml(p.summary || '');
      const pubDate = new Date(p.date).toUTCString();
      return `\n    <item>\n      <title>${title}</title>\n      <link>${link}</link>\n      <guid>${link}</guid>\n      <pubDate>${pubDate}</pubDate>\n      <description>${desc}</description>\n    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>Personal Site Blog</title>\n    <link>${site}</link>\n    <description>Blog feed</description>\n    <language>ja</language>${items}\n  </channel>\n</rss>`;

  await writeFile(path.join(process.cwd(), 'out', 'rss.xml'), rss);
  console.log('rss.xml generated');
}

async function main() {
  await generateSitemap();
  await generateRobots();
  await generateRSS();
  await writeFile(path.join(process.cwd(), 'out', '.nojekyll'), '');
}

main();
