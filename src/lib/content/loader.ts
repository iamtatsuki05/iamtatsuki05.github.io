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

export async function loadCollection<T>({ dir, cacheKey, exts = ['.md', '.mdx'], parse, sort }: LoaderOptions<T>): Promise<T[]> {
  return cached<T[]>(cacheKey, async () => {
    const files = await fs.readdir(dir);
    const filtered = files.filter((f) => exts.includes(path.extname(f)));
    const parsedItems: Array<T | null> = await Promise.all(
      filtered.map(async (filename) => {
        const full = path.join(dir, filename);
        return parse(full, filename);
      }),
    );
    const items = parsedItems.filter((item): item is T => item !== null);
    if (sort) {
      items.sort(sort);
    }
    return items;
  });
}
