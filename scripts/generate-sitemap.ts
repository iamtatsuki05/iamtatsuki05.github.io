#!/usr/bin/env bun
import { copyFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { buildRobotsTxt, buildRssXml, buildSitemapXml } from '../lib/server/site-files';
import { ensureFaviconFromPngs } from './utils/favicon';

async function ensureFavicon(outDir: string) {
  const icoPath = path.join(outDir, 'favicon.ico');
  const publicDir = path.join(process.cwd(), 'public');

  try {
    const publicIco = path.join(publicDir, 'favicon.ico');
    await stat(publicIco);
    await copyFile(publicIco, icoPath);
    console.log('copied public/favicon.ico');
    return;
  } catch {}

  try {
    const fallbackIco = path.join(publicDir, 'images', 'favicon.ico');
    await stat(fallbackIco);
    await copyFile(fallbackIco, icoPath);
    console.log('copied public/images/favicon.ico to out/favicon.ico');
    return;
  } catch {}

  const generated = await ensureFaviconFromPngs(icoPath, [
    { path: path.join(publicDir, 'favicon-32x32.png'), size: 32 },
    { path: path.join(outDir, 'favicon-32x32.png'), size: 32 },
    { path: path.join(publicDir, 'favicon-16x16.png'), size: 16 },
    { path: path.join(outDir, 'favicon-16x16.png'), size: 16 },
  ]);

  if (generated) {
    console.log(`generated favicon.ico from ${path.basename(generated)}`);
  } else {
    console.warn('could not ensure favicon.ico');
  }
}

async function main() {
  const outDir = path.join(process.cwd(), 'out');
  await writeFile(path.join(outDir, 'sitemap.xml'), await buildSitemapXml());
  console.log('sitemap.xml generated');

  await writeFile(path.join(outDir, 'robots.txt'), await buildRobotsTxt());
  console.log('robots.txt generated');

  await writeFile(path.join(outDir, 'rss.xml'), await buildRssXml());
  console.log('rss.xml generated');

  await writeFile(path.join(outDir, '.nojekyll'), '');
  await ensureFavicon(outDir);
}

main();
