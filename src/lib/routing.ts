import type { Locale } from '@/lib/i18n';

const LOCALE_PREFIX = /^\/(ja|en)(\/|$)/;

export function extractLocaleFromPath(pathname: string): Locale | null {
  const m = pathname.match(LOCALE_PREFIX);
  if (!m) return null;
  return m[1] === 'en' ? 'en' : 'ja';
}

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '/');
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  if (normalized === '/' || normalized === '/ja/' || normalized === '/en/') {
    return locale === 'ja' ? '/ja/' : '/en/';
  }
  const clean = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `/${locale}${clean}`.replace(/\/+/g, '/');
}

export function isTranslatablePath(pathname: string): boolean {
  if (!pathname) return false;
  const bare = stripLocalePrefix(pathname);
  return ['/', '/links/', '/publications/', '/blogs/'].includes(
    bare.endsWith('/') ? bare : `${bare}/`,
  );
}
