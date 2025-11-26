import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { LinksPage as LinksPageView } from '@/app/(site)/_components/LinksPage';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { linksPageCopy } from '@/app/(site)/_config/pageCopy';
import { getPageMeta } from '@/lib/seo/metaConfig';

const DEFAULT_LOCALE: Locale = 'ja';
const copy = linksPageCopy[DEFAULT_LOCALE];
const pageMeta = getPageMeta('links', DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata({
  title: pageMeta.metadataTitle,
  description: pageMeta.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: pageMeta.path,
  languageAlternates: defaultLanguageAlternates,
});

export default function LinksPage() {
  return <LinksPageView locale={DEFAULT_LOCALE} />;
}
