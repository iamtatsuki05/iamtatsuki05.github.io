import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { loadCollection } from '@/lib/content/loader';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('loadCollection', () => {
  it('parses matching files concurrently and keeps null results out of the collection', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'collection-loader-'));
    tempDirs.push(dir);
    await Promise.all([
      fs.writeFile(path.join(dir, 'a.md'), 'A'),
      fs.writeFile(path.join(dir, 'b.mdx'), 'B'),
      fs.writeFile(path.join(dir, 'ignored.txt'), 'ignored'),
    ]);

    let activeParses = 0;
    let maxActiveParses = 0;
    const items = await loadCollection({
      dir,
      cacheKey: `content-loader-test-${Date.now()}`,
      parse: async (_fullPath, filename) => {
        activeParses += 1;
        maxActiveParses = Math.max(maxActiveParses, activeParses);
        await new Promise((resolve) => setTimeout(resolve, filename === 'a.md' ? 20 : 1));
        activeParses -= 1;
        return filename === 'a.md' ? null : filename;
      },
      sort: (left, right) => left.localeCompare(right),
    });

    expect(items).toEqual(['b.mdx']);
    expect(maxActiveParses).toBeGreaterThan(1);
  });
});
