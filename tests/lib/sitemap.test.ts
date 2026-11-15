import { describe, expect, it } from 'vitest';
import { GET } from '@/pages/sitemap.xml';

describe('sitemap.xml', () => {
  it('lists only canonical URLs, so Japanese appears unprefixed and never under /ja-JP/', async () => {
    const body = await (await GET({} as Parameters<typeof GET>[0])).text();
    const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc).pathname);

    expect(locs).toContain('/');
    expect(locs).toContain('/cv/');
    expect(locs).toContain('/en-US/cv/');
    expect(locs.some((path) => /^\/blogs\/[^/]+\/$/.test(path))).toBe(true);
    expect(locs.filter((path) => path.startsWith('/ja-JP/'))).toEqual([]);
    expect(new Set(locs).size).toBe(locs.length);
  });
});
