import type { Metadata } from 'next';
import { buildLanguageAlternates, buildPageMetadata } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import { resolveLocale, SUPPORTED_ROUTE_LOCALES, SUPPORTED_LOCALES } from '@/lib/i18n';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';

type CopyBase = {
  metadataTitle: string;
  metadataDescription: string;
  path: string;
};

export function localizedStaticParams() {
  return [...SUPPORTED_ROUTE_LOCALES, ...SUPPORTED_LOCALES].map((locale) => ({ locale }));
}

export async function buildLocalizedMetadata(
  params: Promise<{ locale: string }>,
  copyMap: Record<Locale, CopyBase>,
  extra?: Partial<Pick<Parameters<typeof buildPageMetadata>[0], 'images' | 'keywords' | 'type' | 'languageAlternates'>>,
): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = copyMap[locale];
  const basePath = copy.path;
  const path = extractLocaleFromPath(basePath) ? basePath : localizedPath(basePath, locale);
  const languageAlternates = extra?.languageAlternates ?? buildLanguageAlternates(path);

  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path,
    languageAlternates,
    images: extra?.images,
    keywords: extra?.keywords,
    type: extra?.type,
  });
}
