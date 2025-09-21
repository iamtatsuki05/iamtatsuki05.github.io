import type { Metadata } from 'next';
import { LinksPage } from '@/app/(site)/_components/LinksPage';
import type { Locale } from '@/lib/i18n';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import {
  SUPPORTED_LOCALES,
  linksPageCopy,
  resolveLocale,
} from '@/app/(site)/_config/pageCopy';

type Params = { locale: string };

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = linksPageCopy[locale];
  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path: copy.path,
    languageAlternates: defaultLanguageAlternates,
  });
}

export default async function LocaleLinksPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <LinksPage locale={locale as Locale} />;
}
