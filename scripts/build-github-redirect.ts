import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const TARGET = 'https://iamtatsuki05.com';

// GitHub Pages cannot send HTTP redirects, so each page redirects with meta refresh plus a canonical link.
// Known paths get their own 200 page; Google does not follow redirects from the 404 fallback.
export function redirectPage(target: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved to ${TARGET}</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This site moved to <a href="${target}">${target}</a>.</p>
</body>
</html>
`;
}

export function fallbackPage(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved to ${TARGET}</title>
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(TARGET)} + location.pathname + location.search + location.hash);</script>
</head>
<body>
<p>This site moved to <a href="${TARGET}/">${TARGET}</a>.</p>
</body>
</html>
`;
}

export function pathsFromSitemap(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

async function main() {
  const outDir = process.argv[2] ?? 'github-redirect';
  const res = await fetch(`${TARGET}/sitemap.xml`);
  if (!res.ok) throw new Error(`Fetching the sitemap failed: ${res.status}`);
  const paths = pathsFromSitemap(await res.text());
  if (!paths.includes('/')) throw new Error('The sitemap has no root page; refusing to publish an empty redirect site');
  for (const p of paths) {
    const dir = path.join(outDir, p);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), redirectPage(`${TARGET}${p}`));
  }
  await writeFile(path.join(outDir, '404.html'), fallbackPage());
  await writeFile(path.join(outDir, '.nojekyll'), '');
  console.log(`wrote ${paths.length} redirect pages to ${outDir}`);
}

if (import.meta.main) await main();
