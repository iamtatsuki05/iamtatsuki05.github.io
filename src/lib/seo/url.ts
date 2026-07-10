import { withBasePath } from '@/lib/url';
import { LOCALE_LABELS, SUPPORTED_LOCALES } from '@/lib/i18n';
import { localizedPath, stripLocalePrefix } from '@/lib/routing';
import { getSiteUrl } from '@/lib/config/env';

export function absoluteUrl(input: string = '/') {
  const raw = input || '/';
  if (/^(https?:)?\/\//i.test(raw)) {
    return raw.startsWith('http') ? raw : `https:${raw}`;
  }
  const withBase = withBasePath(raw.startsWith('/') ? raw : `/${raw}`) ?? '/';
  return new URL(withBase, getSiteUrl()).toString();
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const raw = path || '/';
  const bare = stripLocalePrefix(raw);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [LOCALE_LABELS[locale], localizedPath(normalized, locale)]),
  );
  return {
    ...languages,
    'x-default': normalized,
  };
}
