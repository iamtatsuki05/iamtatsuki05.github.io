import fs from 'node:fs/promises';
import path from 'node:path';
import type { OGData } from './types';

export async function readCache(file: string): Promise<Record<string, OGData>> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function writeCache(file: string, data: Record<string, OGData>) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

export function isFresh(entry: OGData | undefined, ttlMs: number): boolean {
  if (!entry?.fetchedAt) return false;
  return Date.now() - entry.fetchedAt < ttlMs;
}

export function hasPreview(entry: OGData | null | undefined): boolean {
  return !!(entry && (entry.title || entry.image || entry.description || entry.siteName));
}

export function upsertCache(cache: Record<string, OGData>, url: string, data: OGData): boolean {
  const prev = cache[url];
  const same = prev && JSON.stringify(prev) === JSON.stringify(data);
  if (!same) {
    cache[url] = data;
    return true;
  }
  return false;
}
