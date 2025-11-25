import type { Metadata } from 'next';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import { resolveLocale, SUPPORTED_LOCALES } from '@/lib/i18n';

type CopyBase = {
  metadataTitle: string;
  metadataDescription: string;
  path: string;
};

export function localizedStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function buildLocalizedMetadata(
  params: Promise<{ locale: string }>,
  copyMap: Record<Locale, CopyBase>,
  extra?: Partial<Pick<Parameters<typeof buildPageMetadata>[0], 'images' | 'keywords' | 'type' | 'languageAlternates'>>,
): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = copyMap[locale];
  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path: copy.path,
    languageAlternates: extra?.languageAlternates ?? defaultLanguageAlternates,
    images: extra?.images,
    keywords: extra?.keywords,
    type: extra?.type,
  });
}
