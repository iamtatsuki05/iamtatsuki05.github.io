import type { Metadata } from 'next';
import { LinksPage } from '@/app/(site)/_components/LinksPage';
import type { Locale } from '@/lib/i18n';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import { linksPageCopy, resolveLocale } from '@/app/(site)/_config/pageCopy';
import { pageMeta } from '@/lib/seo/metaConfig';

type Params = { locale: string };

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, pageMeta.links);
}

export default async function LocaleLinksPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <LinksPage locale={locale as Locale} />;
}
