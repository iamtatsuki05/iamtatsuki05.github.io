import { SUPPORTED_LOCALES, SUPPORTED_ROUTE_LOCALES } from '@/lib/i18n';

export const LOCALE_ROUTE_SEGMENTS = [...SUPPORTED_ROUTE_LOCALES, ...SUPPORTED_LOCALES];

export function localeStaticPaths() {
  return LOCALE_ROUTE_SEGMENTS.map((locale) => ({ params: { locale } }));
}
