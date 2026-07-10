import type { Locale } from '@/lib/i18n';
import { resolveLocale } from '@/lib/i18n';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { siteConfig } from './config';
import type { PageMetadata } from './types';
import { absoluteUrl, buildLanguageAlternates } from './url';

type Alternates = Record<string, string>;

type ImageMetadata = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildMetadataOptions = {
  title: string;
  description?: string;
  locale?: Locale;
  path?: string;
  type?: 'website' | 'article';
  images?: (string | ImageMetadata)[];
  keywords?: string[];
  languageAlternates?: Alternates;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

function resolveImages(candidates?: (string | ImageMetadata)[]) {
  const list = candidates?.length ? candidates : [siteConfig.defaultOgImage];
  return list
    .filter((item): item is string | ImageMetadata => Boolean(item))
    .map((item) => {
      if (typeof item === 'string') {
        return { url: absoluteUrl(item) };
      }
      return {
        url: absoluteUrl(item.url),
        width: item.width,
        height: item.height,
        alt: item.alt,
      };
    });
}

export function buildPageMetadata({
  title,
  description,
  locale = 'ja',
  path = '/',
  type = 'website',
  images,
  keywords = [],
  languageAlternates,
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataOptions): PageMetadata {
  const base = siteConfig.siteName[locale] || siteConfig.siteName.ja;
  const finalTitle = title.includes(base) ? title : `${title} | ${base}`;
  const finalDescription = description || siteConfig.description[locale];
  const canonicalUrl = absoluteUrl(path);
  const ogImages = resolveImages(images);
  const mergedKeywords = Array.from(new Set([...(siteConfig.keywords[locale] || []), ...keywords]));

  const alternates = languageAlternates
    ? Object.fromEntries(
        Object.entries(languageAlternates).map(([key, value]) => [key, absoluteUrl(value)]),
      )
    : undefined;

  const metadata: PageMetadata = {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
      ...(alternates ? { languages: alternates } : {}),
    },
    keywords: mergedKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: siteConfig.siteName[locale],
      locale: {
        ja: 'ja_JP',
        en: 'en_US',
        zh: 'zh_CN',
        fr: 'fr_FR',
      }[locale],
      type,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      creator: siteConfig.twitterHandle,
      images: ogImages,
    },
    authors: [{ name: siteConfig.owner, url: absoluteUrl('/') }],
    creator: siteConfig.owner,
    publisher: siteConfig.owner,
  };

  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [siteConfig.owner],
      tags,
    };
    metadata.twitter = {
      ...metadata.twitter,
    };
  }

  return metadata;
}

type LocalizedCopy = {
  metadataTitle: string;
  metadataDescription: string;
  path: string;
};

export function buildLocalizedMetadata(
  routeLocale: string,
  copyMap: Record<Locale, LocalizedCopy>,
  extra?: Partial<Pick<BuildMetadataOptions, 'images' | 'keywords' | 'type' | 'languageAlternates'>>,
): PageMetadata {
  const locale = resolveLocale(routeLocale);
  const copy = copyMap[locale];
  const basePath = copy.path;
  const path = extractLocaleFromPath(basePath) ? basePath : localizedPath(basePath, locale);
  const languageAlternates = extra?.languageAlternates ?? buildLanguageAlternates(path);

  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path,
    languageAlternates,
    images: extra?.images,
    keywords: extra?.keywords,
    type: extra?.type,
  });
}
