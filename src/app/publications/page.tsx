import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { PublicationsPage as PublicationsPageView } from '@/app/(site)/_components/PublicationsPage';
import { buildPageMetadata, buildCollectionPageJsonLd, buildBreadcrumbJsonLd, defaultLanguageAlternates, absoluteUrl } from '@/lib/seo';
import { publicationsPageCopy } from '@/app/(site)/_config/pageCopy';
import { getPageMeta } from '@/lib/seo/metaConfig';
import { getAllPublications } from '@/lib/content/publication';

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

export default async function PublicationsPage() {
  const publications = await getAllPublications();
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: '/publications/',
    name: 'Publications',
    description: '学術論文と研究成果',
    itemCount: publications.length,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Publications', url: absoluteUrl('/publications/') },
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
      <PublicationsPageView locale={DEFAULT_LOCALE} />
    </>
  );
}
