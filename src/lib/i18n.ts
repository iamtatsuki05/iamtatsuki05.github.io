import ja from '@/locales/ja/common.json';
import en from '@/locales/en/common.json';

export type Locale = 'ja' | 'en';
export type RouteLocale = 'ja-JP' | 'en-US';

export const LOCALE_LABELS: Record<Locale, string> = {
  ja: 'ja-JP',
  en: 'en-US',
};

export const LOCALE_UI_LABELS: Record<Locale, string> = {
  ja: 'JA',
  en: 'EN',
};

export const ROUTE_LOCALES: Record<Locale, RouteLocale> = {
  ja: 'ja-JP',
  en: 'en-US',
};

export const dictionaries: Record<Locale, typeof ja> = {
  ja,
  en,
};

export const SUPPORTED_LOCALES: Locale[] = ['ja', 'en'];
export const SUPPORTED_ROUTE_LOCALES: RouteLocale[] = Object.values(ROUTE_LOCALES);

const LOCALE_NORMALIZE_MAP: Record<string, Locale> = {
  ja: 'ja',
  'ja-jp': 'ja',
  en: 'en',
  'en-us': 'en',
};

export function resolveLocale(raw: string): Locale {
  return LOCALE_NORMALIZE_MAP[raw.toLowerCase()] ?? 'ja';
}

export function localeToRouteLocale(locale: Locale): RouteLocale {
  return ROUTE_LOCALES[locale];
}
