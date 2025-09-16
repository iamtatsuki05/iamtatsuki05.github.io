import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { buildPageMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.defaultTitle.en,
  description: siteConfig.description.en,
  locale: 'en',
  path: '/en/',
  languageAlternates: {
    'ja-JP': '/ja/',
    'en-US': '/en/',
    'x-default': '/',
  },
});

export default function Page() {
  return <HomeContent locale="en" />;
}
