import type { Locale } from '@/lib/i18n';
import { SUPPORTED_LOCALES, resolveLocale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo/metaConfig';

export { SUPPORTED_LOCALES, resolveLocale };

export type PageCopy<T extends Record<string, unknown> = {}> = {
  metadataTitle: string;
  metadataDescription: string;
  path: string;
  heading: string;
  breadcrumb: string;
} & T;

export type BlogsPageCopy = PageCopy;

export const blogsPageCopy: Record<Locale, BlogsPageCopy> = {
  ja: {
    ...pageMeta.blogs.ja,
    heading: '📝 Blog',
    breadcrumb: '🏠 Home / 📝 Blog',
  },
  en: {
    ...pageMeta.blogs.en,
    heading: '📝 Blog',
    breadcrumb: '🏠 Home / 📝 Blog',
  },
};

export type LinksPageCopy = PageCopy<{
  groupFallback: string;
  moreLabel: string;
}>;

export const linksPageCopy: Record<Locale, LinksPageCopy> = {
  ja: {
    ...pageMeta.links.ja,
    heading: '🔗 リンク',
    breadcrumb: '🏠 Home / 🔗 リンク',
    groupFallback: 'その他',
    moreLabel: 'さらに表示',
  },
  en: {
    ...pageMeta.links.en,
    heading: '🔗 Links',
    breadcrumb: '🏠 Home / 🔗 Links',
    groupFallback: 'Other',
    moreLabel: 'See more',
  },
};

export type PublicationsPageCopy = PageCopy;

export const publicationsPageCopy: Record<Locale, PublicationsPageCopy> = {
  ja: {
    ...pageMeta.publications.ja,
    heading: '📚 公開物',
    breadcrumb: '🏠 Home / 📚 公開物',
  },
  en: {
    ...pageMeta.publications.en,
    heading: '📚 Publications',
    breadcrumb: '🏠 Home / 📚 Publications',
  },
};
