#!/usr/bin/env bun
import { readdir, writeFile, copyFile, stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { getAllPosts } from '../lib/content/blog';

const site =
  (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://iamtatsuki05.github.io');

function normalizeBasePath(input?: string | null): string {
  const raw = (input ?? '').trim();
  if (!raw || raw === '/') return '';
  const stripped = raw.replace(/^\/+|\/+$/g, '');
  return `/${stripped}`;
}
const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const trimmed = site.replace(/\/$/, '');
const siteWithBase = BASE_PATH && !trimmed.endsWith(BASE_PATH) ? `${trimmed}${BASE_PATH}` : trimmed;

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
    .map((slug) => `${siteWithBase}/blogs/${slug}/`);

  const staticUrls = [
    `${siteWithBase}/`,
    `${siteWithBase}/ja/`,
    `${siteWithBase}/en/`,
    `${siteWithBase}/links/`,
    `${siteWithBase}/publications/`,
    `${siteWithBase}/blogs/`,
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
  const robots = `User-agent: *\nAllow: /\nSitemap: ${siteWithBase}/sitemap.xml\n`;
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
  // ensure /favicon.ico exists for static hosting
  const outDir = path.join(process.cwd(), 'out');
  const icoPath = path.join(outDir, 'favicon.ico');
  const pubDir = path.join(process.cwd(), 'public');

  function buildIcoFromPngBytes(png: Uint8Array, size: number): Uint8Array {
    const header = new Uint8Array(6);
    const h = new DataView(header.buffer);
    h.setUint16(0, 0, true);
    h.setUint16(2, 1, true);
    h.setUint16(4, 1, true);
    const entry = new Uint8Array(16);
    entry[0] = size === 256 ? 0 : Math.min(size, 255);
    entry[1] = size === 256 ? 0 : Math.min(size, 255);
    entry[2] = 0;
    entry[3] = 0;
    const e = new DataView(entry.buffer);
    e.setUint16(4, 1, true);
    e.setUint16(6, 32, true);
    e.setUint32(8, png.length, true);
    e.setUint32(12, 6 + 16, true);
    const ico = new Uint8Array(header.length + entry.length + png.length);
    ico.set(header, 0);
    ico.set(entry, header.length);
    ico.set(png, header.length + entry.length);
    return ico;
  }

  try {
    // 1) public/favicon.ico があれば優先
    const publicIco = path.join(pubDir, 'favicon.ico');
    await stat(publicIco);
    await copyFile(publicIco, icoPath);
    console.log('copied public/favicon.ico');
  } catch {
    // 2) 指定の JPEG を /favicon.ico としてコピー
    try {
      const jpeg = path.join(pubDir, 'images', 'icon.jpeg');
      await stat(jpeg);
      await copyFile(jpeg, icoPath);
      console.log('copied public/images/icon.jpeg to out/favicon.ico');
    } catch {
      // 3) フォールバック: PNG から簡易 ICO を生成
      const candidates = [
        path.join(pubDir, 'favicon-32x32.png'),
        path.join(outDir, 'favicon-32x32.png'),
        path.join(pubDir, 'favicon-16x16.png'),
        path.join(outDir, 'favicon-16x16.png'),
      ];
      let created = false;
      for (const p of candidates) {
        try {
          const data = await readFile(p);
          const u8 = new Uint8Array(data.length);
          u8.set(data);
          const size = p.includes('32x32') ? 32 : 16;
          const ico = buildIcoFromPngBytes(u8, size);
          await writeFile(icoPath, ico);
          console.log('generated favicon.ico from', path.basename(p));
          created = true;
          break;
        } catch {}
      }
      if (!created) console.warn('could not ensure favicon.ico');
    }
  }
}

main();
