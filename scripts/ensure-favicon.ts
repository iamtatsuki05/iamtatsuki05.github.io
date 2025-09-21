#!/usr/bin/env bun
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { ensureFaviconFromPngs } from './utils/favicon';

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const icoPath = path.join(publicDir, 'favicon.ico');
  try {
    await stat(icoPath);
    console.log('[ensure-favicon] public/favicon.ico exists');
    return;
  } catch {}

  const source = await ensureFaviconFromPngs(icoPath, [
    { path: path.join(publicDir, 'favicon-32x32.png'), size: 32 },
    { path: path.join(publicDir, 'favicon-16x16.png'), size: 16 },
  ]);

  if (source) {
    console.log(`[ensure-favicon] created favicon.ico from ${path.basename(source)}`);
    return;
  }

  console.warn('[ensure-favicon] could not create public/favicon.ico (no PNG found)');
}

main();
