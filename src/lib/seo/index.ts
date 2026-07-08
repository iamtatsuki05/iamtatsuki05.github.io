export type { PageMetadata } from './types';
export { siteConfig } from './config';
export { absoluteUrl, buildLanguageAlternates } from './url';
export { buildLocalizedMetadata, buildPageMetadata } from './metadata';
export {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildCollectionPageJsonLd,
  buildOrganizationJsonLd,
  buildPersonJsonLd,
  buildSiteLinksJsonLd,
  buildWebsiteJsonLd,
} from './jsonld';
