import { NextResponse } from 'next/server';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

export const dynamic = 'force-static';

function buildIcoFromPngBytes(png: Uint8Array, size: number): Uint8Array {
  const header = new Uint8Array(6);
  const h = new DataView(header.buffer);
  h.setUint16(0, 0, true); // reserved
  h.setUint16(2, 1, true); // type: icon
  h.setUint16(4, 1, true); // count: 1

  const entry = new Uint8Array(16);
  entry[0] = size === 256 ? 0 : Math.min(size, 255); // width (0 means 256)
  entry[1] = size === 256 ? 0 : Math.min(size, 255); // height
  entry[2] = 0; // color count
  entry[3] = 0; // reserved
  const e = new DataView(entry.buffer);
  e.setUint16(4, 1, true); // planes
  e.setUint16(6, 32, true); // bit count
  e.setUint32(8, png.length, true); // bytes in resource
  e.setUint32(12, 6 + 16, true); // offset to image data

  const ico = new Uint8Array(header.length + entry.length + png.length);
  ico.set(header, 0);
  ico.set(entry, header.length);
  ico.set(png, header.length + entry.length);
  return ico;
}

export async function GET() {
  // ユーザー指定の JPEG を常に返す
  const jpegPath = path.join(process.cwd(), 'public', 'images', 'icon.jpeg');
  try {
    await stat(jpegPath);
    const buf = await readFile(jpegPath);
    // ArrayBuffer 化して Blob に包む（型互換のため）
    const ab = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(buf);
    const blob = new Blob([ab], { type: 'image/jpeg' });
    const cache = process.env.NODE_ENV === 'development' ? 'no-store' : 'public, max-age=31536000, immutable';
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': cache,
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
