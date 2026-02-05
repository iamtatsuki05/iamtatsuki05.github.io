import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { LinksPage as LinksPageView } from '@/app/(site)/_components/LinksPage';
import { buildPageMetadata, buildCollectionPageJsonLd, buildBreadcrumbJsonLd, buildLanguageAlternates, absoluteUrl } from '@/lib/seo';
import { linksPageCopy } from '@/app/(site)/_config/pageCopy';
import { getPageMeta } from '@/lib/seo/metaConfig';
import { getLinks } from '@/lib/data/links';

const DEFAULT_LOCALE: Locale = 'ja';
const copy = linksPageCopy[DEFAULT_LOCALE];
const pageMeta = getPageMeta('links', DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata({
  title: pageMeta.metadataTitle,
  description: pageMeta.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: pageMeta.path,
  languageAlternates: buildLanguageAlternates(pageMeta.path),
});

export default async function LinksPage() {
  const links = await getLinks();
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: '/links/',
    name: 'Links',
    description: 'SNSと外部リンク集',
    itemCount: links.length,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Links', url: absoluteUrl('/links/') },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LinksPageView locale={DEFAULT_LOCALE} />
    </>
  );
}
