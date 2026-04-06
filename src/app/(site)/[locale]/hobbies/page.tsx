import type { Metadata } from 'next';
import { HobbiesPage } from '@/app/(site)/_components/HobbiesPage';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import { resolveLocale } from '@/app/(site)/_config/pageCopy';
import { pageMeta } from '@/lib/seo/metaConfig';

type Params = { locale: string };

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, pageMeta.hobbies);
}

export default async function LocaleHobbiesPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <HobbiesPage locale={locale} />;
}
