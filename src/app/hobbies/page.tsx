import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { HobbiesPage as HobbiesPageView } from '@/app/(site)/_components/HobbiesPage';
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildLanguageAlternates,
  buildPageMetadata,
} from '@/lib/seo';
import { resolveHobbies } from '@/lib/data/hobbies';
import { getPageMeta } from '@/lib/seo/metaConfig';

const DEFAULT_LOCALE: Locale = 'ja';
const pageMeta = getPageMeta('hobbies', DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata({
  title: pageMeta.metadataTitle,
  description: pageMeta.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: pageMeta.path,
  languageAlternates: buildLanguageAlternates(pageMeta.path),
});

export default async function HobbiesPage() {
  const hobbies = resolveHobbies(DEFAULT_LOCALE);
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: '/hobbies/',
    name: 'Hobbies',
    description: '趣味と最近ハマっていることの一覧',
    itemCount: hobbies.length,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Hobbies', url: absoluteUrl('/hobbies/') },
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
      <HobbiesPageView locale={DEFAULT_LOCALE} />
    </>
  );
}
