import type { Locale } from '@/lib/i18n';
import { absoluteUrl, type PageMetadata, siteConfig } from '@/lib/seo';

export type AstroMetadata = PageMetadata & {
  htmlLang?: string;
};

export function pageTitle(metadata: PageMetadata) {
  return typeof metadata.title === 'string' ? metadata.title : siteConfig.siteName.ja;
}

export function renderMetadata(metadata: AstroMetadata) {
  const title = pageTitle(metadata);
  const description = metadata.description || siteConfig.description.ja;
  const canonical = String(metadata.alternates?.canonical || absoluteUrl('/'));
  const openGraph = metadata.openGraph || {};
  const twitter = metadata.twitter || {};
  const keywords = Array.isArray(metadata.keywords) ? metadata.keywords.join(', ') : metadata.keywords;
  const images = openGraph.images?.length ? openGraph.images : twitter.images;
  const primaryImage = images?.[0];
  const image = primaryImage?.url || absoluteUrl(siteConfig.defaultOgImage);

  return {
    title,
    description,
    canonical,
    keywords,
    image,
    ogTitle: openGraph.title || title,
    ogDescription: openGraph.description || description,
    ogUrl: openGraph.url || canonical,
    ogSiteName: openGraph.siteName || siteConfig.siteName.ja,
    ogLocale: openGraph.locale || 'ja_JP',
    ogType: openGraph.type || 'website',
    ogImages: images?.length ? images : [{ url: image }],
    twitterCard: twitter.card || 'summary_large_image',
    twitterCreator: twitter.creator || siteConfig.twitterHandle,
    twitterSite: twitter.site || siteConfig.twitterHandle,
    twitterTitle: twitter.title || title,
    twitterDescription: twitter.description || description,
    twitterImageAlt: primaryImage?.alt,
    articlePublishedTime: openGraph.publishedTime,
    articleModifiedTime: openGraph.modifiedTime,
    articleAuthors: openGraph.authors || [],
    articleTags: openGraph.tags || [],
    languages: metadata.alternates?.languages || {},
  };
}

export function htmlLangFromLocale(locale: Locale) {
  return locale === 'ja' ? 'ja' : 'en';
}
