import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { PublicationsPage as PublicationsPageView } from '@/app/(site)/_components/PublicationsPage';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { publicationsPageCopy } from '@/app/(site)/_config/pageCopy';

const DEFAULT_LOCALE: Locale = 'en';
const copy = publicationsPageCopy[DEFAULT_LOCALE];

export const metadata: Metadata = buildPageMetadata({
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: '/publications/',
  languageAlternates: defaultLanguageAlternates,
});

export default function PublicationsPage() {
  return <PublicationsPageView locale={DEFAULT_LOCALE} />;
}
