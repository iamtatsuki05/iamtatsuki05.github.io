import { afterEach, describe, expect, it, vi } from 'vitest';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe('withVersion', () => {
  it('appends query parameter when version exists', async () => {
    process.env.NEXT_PUBLIC_ASSET_VERSION = 'abcdef12';
    const { withVersion } = await import('@/lib/url');
    expect(withVersion('/images/icon.png')).toBe('/images/icon.png?v=abcdef12');
  });

  it('skips version suffix for favicon ico files', async () => {
    process.env.NEXT_PUBLIC_ASSET_VERSION = 'abcdef12';
    const { withVersion } = await import('@/lib/url');
    expect(withVersion('/favicon.ico')).toBe('/favicon.ico');
  });

  it('keeps existing query parameters intact', async () => {
    process.env.NEXT_PUBLIC_ASSET_VERSION = 'abcdef12';
    const { withVersion } = await import('@/lib/url');
    expect(withVersion('/avatar.png?foo=bar')).toBe('/avatar.png?foo=bar&v=abcdef12');
  });
});
