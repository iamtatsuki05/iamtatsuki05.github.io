import { readFile, writeFile } from 'node:fs/promises';

export function buildIcoFromPngBytes(png: Uint8Array, sizeHint: number): Uint8Array {
  const header = new Uint8Array(6);
  const headerView = new DataView(header.buffer);
  headerView.setUint16(0, 0, true);
  headerView.setUint16(2, 1, true);
  headerView.setUint16(4, 1, true);

  const entry = new Uint8Array(16);
  entry[0] = sizeHint === 256 ? 0 : Math.min(sizeHint, 255);
  entry[1] = sizeHint === 256 ? 0 : Math.min(sizeHint, 255);
  entry[2] = 0;
  entry[3] = 0;
  const entryView = new DataView(entry.buffer);
  entryView.setUint16(4, 1, true);
  entryView.setUint16(6, 32, true);
  entryView.setUint32(8, png.length, true);
  entryView.setUint32(12, header.length + entry.length, true);

  const ico = new Uint8Array(header.length + entry.length + png.length);
  ico.set(header, 0);
  ico.set(entry, header.length);
  ico.set(png, header.length + entry.length);
  return ico;
}

export async function convertPngToIco(src: string, dest: string, sizeHint: number): Promise<boolean> {
  try {
    const data = await readFile(src);
    const buffer = new Uint8Array(data.length);
    buffer.set(data);
    const ico = buildIcoFromPngBytes(buffer, sizeHint);
    await writeFile(dest, ico);
    return true;
  } catch {
    return false;
  }
}

export async function ensureFaviconFromPngs(
  dest: string,
  candidates: { path: string; size: number }[],
): Promise<string | null> {
  for (const candidate of candidates) {
    const success = await convertPngToIco(candidate.path, dest, candidate.size);
    if (success) {
      return candidate.path;
    }
  }
  return null;
}
