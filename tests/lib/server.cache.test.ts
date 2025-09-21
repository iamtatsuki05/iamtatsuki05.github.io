import { afterEach, describe, expect, it, vi } from 'vitest';
import { cached, clearCache } from '@/lib/server/cache';

const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = ORIGINAL_NODE_ENV;
  clearCache();
});

describe('cached helper', () => {
  it('returns cached value in production', async () => {
    process.env.NODE_ENV = 'production';
    const loader = vi.fn().mockResolvedValue(42);
    const first = await cached('test:key', loader);
    const second = await cached('test:key', loader);
    expect(first).toBe(42);
    expect(second).toBe(42);
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('bypasses cache outside production', async () => {
    process.env.NODE_ENV = 'development';
    const loader = vi
      .fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second');
    const first = await cached('test:dev', loader);
    const second = await cached('test:dev', loader);
    expect(first).toBe('first');
    expect(second).toBe('second');
    expect(loader).toHaveBeenCalledTimes(2);
  });
});
