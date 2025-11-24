import fs from 'node:fs/promises';
import path from 'node:path';
import { cached } from '@/lib/server/cache';

type LoaderOptions<T> = {
  dir: string;
  cacheKey: string;
  exts?: string[];
  parse: (fullPath: string, filename: string) => Promise<T | null>;
  sort?: (a: T, b: T) => number;
};

export async function loadCollection<T>({ dir, cacheKey, exts = ['.md', '.mdx'], parse, sort }: LoaderOptions<T>) {
  return cached(cacheKey, async () => {
    const files = await fs.readdir(dir);
    const filtered = files.filter((f) => exts.includes(path.extname(f)));
    const items: T[] = [];
    for (const filename of filtered) {
      const full = path.join(dir, filename);
      const parsed = await parse(full, filename);
      if (parsed) items.push(parsed);
    }
    if (sort) {
      items.sort(sort);
    }
    return items;
  });
}
