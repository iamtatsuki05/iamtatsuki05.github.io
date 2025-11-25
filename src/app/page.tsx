import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { getPageMeta } from '@/lib/seo/metaConfig';

const homeMeta = getPageMeta('home', 'ja');

export const metadata: Metadata = buildPageMetadata({
  title: homeMeta.metadataTitle,
  description: homeMeta.metadataDescription,
  locale: 'ja',
  path: homeMeta.path,
  languageAlternates: defaultLanguageAlternates,
});

export default function Page() {
  return <HomeContent locale="ja" />;
}
