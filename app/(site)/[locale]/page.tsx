import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import type { Locale } from '@/lib/i18n';
import { buildPageMetadata, defaultLanguageAlternates, siteConfig } from '@/lib/seo';
import { SUPPORTED_LOCALES, resolveLocale } from '@/app/(site)/_config/pageCopy';

type Params = {
  locale: string;
};

function resolvePath(locale: Locale): string {
  return locale === 'ja' ? '/ja/' : '/en/';
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  return buildPageMetadata({
    title: siteConfig.defaultTitle[locale],
    description: siteConfig.description[locale],
    locale,
    path: resolvePath(locale),
    languageAlternates: defaultLanguageAlternates,
  });
}

export default async function LocaleHomePage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  return <HomeContent locale={locale} />;
}
