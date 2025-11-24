import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { LinksPage as LinksPageView } from '@/app/(site)/_components/LinksPage';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { linksPageCopy } from '@/app/(site)/_config/pageCopy';

const DEFAULT_LOCALE: Locale = 'en';
const copy = linksPageCopy[DEFAULT_LOCALE];

export const metadata: Metadata = buildPageMetadata({
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: '/links/',
  languageAlternates: defaultLanguageAlternates,
});

export default function LinksPage() {
  return <LinksPageView locale={DEFAULT_LOCALE} />;
}
