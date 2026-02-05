import type { Locale } from '@/lib/i18n';
import { SUPPORTED_ROUTE_LOCALES, localeToRouteLocale, resolveLocale, SUPPORTED_LOCALES } from '@/lib/i18n';

const ROUTE_PREFIXES = [...SUPPORTED_ROUTE_LOCALES, ...SUPPORTED_LOCALES];
const LOCALE_PREFIX = new RegExp(`^/(${ROUTE_PREFIXES.join('|')})(/|$)`, 'i');
const LOCALE_ROOTS = new Set(
  ROUTE_PREFIXES.map((segment) => `/${segment.toLowerCase()}/`),
);

export function extractLocaleFromPath(pathname: string): Locale | null {
  const m = pathname.match(LOCALE_PREFIX);
  if (!m) return null;
  return resolveLocale(m[1]);
}

export function stripLocalePrefix(pathname: string): string {
  return pathname.replace(LOCALE_PREFIX, '/');
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const lower = normalized.toLowerCase();
  if (lower === '/' || LOCALE_ROOTS.has(lower)) {
    return `/${localeToRouteLocale(locale)}/`;
  }
  const clean = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `/${localeToRouteLocale(locale)}${clean}`.replace(/\/+/g, '/');
}

export function isTranslatablePath(pathname: string): boolean {
  if (!pathname) return false;
  const bare = stripLocalePrefix(pathname);
  return ['/', '/links/', '/publications/', '/blogs/'].includes(
    bare.endsWith('/') ? bare : `${bare}/`,
  );
}
