#!/usr/bin/env bun
import { stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// PNG を 1枚だけ含む単純な ICO を生成（PNG コンテナ ICO）
function buildIcoFromPngBytes(png: Uint8Array, sizeHint: number): Uint8Array {
  const header = new Uint8Array(6);
  const h = new DataView(header.buffer);
  h.setUint16(0, 0, true); // reserved
  h.setUint16(2, 1, true); // type: icon
  h.setUint16(4, 1, true); // count: 1

  const entry = new Uint8Array(16);
  entry[0] = sizeHint === 256 ? 0 : Math.min(sizeHint, 255); // width
  entry[1] = sizeHint === 256 ? 0 : Math.min(sizeHint, 255); // height
  entry[2] = 0; // colors in palette
  entry[3] = 0; // reserved
  const e = new DataView(entry.buffer);
  e.setUint16(4, 1, true); // color planes
  e.setUint16(6, 32, true); // bit depth (hint)
  e.setUint32(8, png.length, true); // image data size
  e.setUint32(12, 6 + 16, true); // image offset

  const ico = new Uint8Array(header.length + entry.length + png.length);
  ico.set(header, 0);
  ico.set(entry, header.length);
  ico.set(png, header.length + entry.length);
  return ico;
}

async function main() {
  const pubDir = path.join(process.cwd(), 'public');
  const icoPath = path.join(pubDir, 'favicon.ico');
  try {
    await stat(icoPath);
    console.log('[ensure-favicon] public/favicon.ico exists');
    return;
  } catch {}

  const candidates = [
    { p: path.join(pubDir, 'favicon-32x32.png'), size: 32 },
    { p: path.join(pubDir, 'favicon-16x16.png'), size: 16 },
  ];

  for (const c of candidates) {
    try {
      const data = await readFile(c.p);
      const u8 = new Uint8Array(data.length);
      u8.set(data);
      const ico = buildIcoFromPngBytes(u8, c.size);
      await writeFile(icoPath, ico);
      console.log(`[ensure-favicon] created favicon.ico from ${path.basename(c.p)}`);
      return;
    } catch {}
  }

  console.warn('[ensure-favicon] could not create public/favicon.ico (no PNG found)');
}

main();

