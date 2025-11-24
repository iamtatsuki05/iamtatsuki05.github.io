import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { buildPageMetadata, defaultLanguageAlternates, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.defaultTitle.ja,
  description: siteConfig.description.ja,
  locale: 'ja',
  path: '/',
  languageAlternates: defaultLanguageAlternates,
});

export default function Page() {
  return <HomeContent locale="ja" />;
}
