import type { Metadata } from 'next';
import { PublicationsPage } from '@/app/(site)/_components/PublicationsPage';
import type { Locale } from '@/lib/i18n';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import {
  SUPPORTED_LOCALES,
  publicationsPageCopy,
  resolveLocale,
} from '@/app/(site)/_config/pageCopy';

type Params = { locale: string };

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = publicationsPageCopy[locale];
  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path: copy.path,
    languageAlternates: defaultLanguageAlternates,
  });
}

export default async function LocalePublicationsPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale) as Locale;
  return <PublicationsPage locale={locale} />;
}
