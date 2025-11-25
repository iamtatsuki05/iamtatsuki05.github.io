import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import type { Locale } from '@/lib/i18n';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import { resolveLocale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo/metaConfig';

type Params = {
  locale: string;
};

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, pageMeta.home);
}

export default async function LocaleHomePage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <HomeContent locale={locale} />;
}
