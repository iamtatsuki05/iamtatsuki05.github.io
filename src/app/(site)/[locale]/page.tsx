import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import type { Locale } from '@/lib/i18n';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import { resolveLocale } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';

type Params = {
  locale: string;
};

const homeCopy: Record<Locale, { metadataTitle: string; metadataDescription: string; path: string }> = {
  ja: { metadataTitle: siteConfig.defaultTitle.ja, metadataDescription: siteConfig.description.ja, path: '/ja/' },
  en: { metadataTitle: siteConfig.defaultTitle.en, metadataDescription: siteConfig.description.en, path: '/en/' },
};

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, homeCopy);
}

export default async function LocaleHomePage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <HomeContent locale={locale} />;
}
