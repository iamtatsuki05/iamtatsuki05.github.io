import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { PublicationsPage as PublicationsPageView } from '@/app/(site)/_components/PublicationsPage';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { publicationsPageCopy } from '@/app/(site)/_config/pageCopy';
import { getPageMeta } from '@/lib/seo/metaConfig';

const DEFAULT_LOCALE: Locale = 'ja';
const copy = publicationsPageCopy[DEFAULT_LOCALE];
const pageMeta = getPageMeta('publications', DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata({
  title: pageMeta.metadataTitle,
  description: pageMeta.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: pageMeta.path,
  languageAlternates: defaultLanguageAlternates,
});

export default function PublicationsPage() {
  return <PublicationsPageView locale={DEFAULT_LOCALE} />;
}
