import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { buildPageMetadata, buildPersonJsonLd, buildWebsiteJsonLd, defaultLanguageAlternates } from '@/lib/seo';
import { getPageMeta } from '@/lib/seo/metaConfig';

const homeMeta = getPageMeta('home', 'ja');

export const metadata: Metadata = buildPageMetadata({
  title: homeMeta.metadataTitle,
  description: homeMeta.metadataDescription,
  locale: 'ja',
  path: homeMeta.path,
  type: 'website',
  images: [
    {
      url: '/favicon.ico',
      width: 1200,
      height: 630,
      alt: '岡田 龍樹 | Tatsuki Okada',
    },
  ],
  keywords: ['ポートフォリオ', 'NLPエンジニア', '機械学習エンジニア', 'ソフトウェアエンジニア'],
  languageAlternates: defaultLanguageAlternates,
});

export default function Page() {
  const personJsonLd = buildPersonJsonLd();
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeContent locale="ja" />
    </>
  );
}
