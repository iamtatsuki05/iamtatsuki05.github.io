import type { Locale } from '@/lib/i18n';
import { extractLocaleFromPath } from '@/lib/routing';

export const LOCALE_PREFERENCE_STORAGE_KEY = 'preferred-locale';

export function readPreferredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)?.toLowerCase();
  if (raw === 'ja' || raw === 'ja-jp') return 'ja';
  if (raw === 'en' || raw === 'en-us') return 'en';
  return null;
}

export function writePreferredLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, locale);
}

export function resolvePreferredLocaleFromPath(pathname: string): Locale {
  return extractLocaleFromPath(pathname) || readPreferredLocale() || 'ja';
}
