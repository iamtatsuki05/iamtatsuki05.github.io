import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_DEV_SITE_URL,
  DEFAULT_SITE_URL,
  getBasePath,
  getOgCacheTtlMs,
  getSiteUrl,
  getSiteUrlWithBasePath,
  normalizeBasePath,
  shouldDisableOgFetch,
  shouldIncludeDrafts,
} from '@/lib/config/env';

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe('normalizeBasePath', () => {
  it('trims and normalizes slashes', () => {
    expect(normalizeBasePath(' repo ')).toBe('/repo');
    expect(normalizeBasePath('/repo/')).toBe('/repo');
    expect(normalizeBasePath('///repo///')).toBe('/repo');
  });

  it('returns empty string for empty-like input', () => {
    expect(normalizeBasePath(undefined)).toBe('');
    expect(normalizeBasePath('')).toBe('');
    expect(normalizeBasePath(' / ')).toBe('');
  });
});

describe('base path helpers', () => {
  it('reads NEXT_PUBLIC_BASE_PATH from env', () => {
    process.env.NEXT_PUBLIC_BASE_PATH = ' project ';
    expect(getBasePath()).toBe('/project');
  });

  it('falls back to empty string when unset', () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(getBasePath()).toBe('');
  });
});

describe('site url helpers', () => {
  it('prefers SITE_URL with pathname', () => {
    process.env.SITE_URL = 'https://example.com/app/';
    expect(getSiteUrl()).toBe('https://example.com/app');
  });

  it('falls back to NEXT_PUBLIC_SITE_URL when SITE_URL is absent', () => {
    delete process.env.SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com/foo/';
    expect(getSiteUrl()).toBe('https://example.com/foo');
  });

  it('returns development default when NODE_ENV=development and no env provided', () => {
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NODE_ENV = 'development';
    expect(getSiteUrl()).toBe(DEFAULT_DEV_SITE_URL);
  });

  it('returns production default otherwise', () => {
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NODE_ENV = 'production';
    expect(getSiteUrl()).toBe(DEFAULT_SITE_URL);
  });

  it('appends base path when needed', () => {
    process.env.SITE_URL = 'https://example.com';
    process.env.NEXT_PUBLIC_BASE_PATH = 'blog';
    expect(getSiteUrlWithBasePath()).toBe('https://example.com/blog');
  });

  it('avoids double-appending when SITE_URL already contains base path', () => {
    process.env.SITE_URL = 'https://example.com/blog';
    process.env.NEXT_PUBLIC_BASE_PATH = '/blog/';
    expect(getSiteUrlWithBasePath()).toBe('https://example.com/blog');
  });
});

describe('feature toggles', () => {
  it('honours INCLUDE_DRAFTS', () => {
    process.env.INCLUDE_DRAFTS = 'true';
    expect(shouldIncludeDrafts()).toBe(true);
    process.env.INCLUDE_DRAFTS = 'false';
    expect(shouldIncludeDrafts()).toBe(false);
  });

  it('honours OG_DISABLE_FETCH', () => {
    process.env.OG_DISABLE_FETCH = 'true';
    expect(shouldDisableOgFetch()).toBe(true);
    delete process.env.OG_DISABLE_FETCH;
    expect(shouldDisableOgFetch()).toBe(false);
  });
});

describe('getOgCacheTtlMs', () => {
  it('returns custom ttl when env is valid', () => {
    process.env.OG_CACHE_TTL_MS = '60000';
    expect(getOgCacheTtlMs()).toBe(60000);
  });

  it('falls back to default when env is invalid', () => {
    process.env.OG_CACHE_TTL_MS = 'invalid';
    expect(getOgCacheTtlMs()).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it('allows overriding default via argument', () => {
    delete process.env.OG_CACHE_TTL_MS;
    expect(getOgCacheTtlMs(10_000)).toBe(10_000);
  });
});
