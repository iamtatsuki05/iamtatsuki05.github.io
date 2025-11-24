import type { Metadata } from 'next';
import { PublicationsPage } from '@/app/(site)/_components/PublicationsPage';
import type { Locale } from '@/lib/i18n';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import { publicationsPageCopy, resolveLocale } from '@/app/(site)/_config/pageCopy';

type Params = { locale: string };

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, publicationsPageCopy);
}

export default async function LocalePublicationsPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale) as Locale;
  return <PublicationsPage locale={locale} />;
}
