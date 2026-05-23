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
    heading: '📝 ブログ',
    breadcrumb: '🏠 Home / 📝 ブログ',
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

export type HobbiesPageCopy = PageCopy<{
  introHeading: string;
  introBody: string;
  gridHeading: string;
  currentFocusLabel: string;
  emptyStateLabel: string;
  ctaLabel: string;
}>;

export const hobbiesPageCopy: Record<Locale, HobbiesPageCopy> = {
  ja: {
    ...pageMeta.hobbies.ja,
    heading: '🧸 趣味',
    breadcrumb: '🏠 Home / 🧸 趣味',
    introHeading: '趣味について',
    introBody:
      'ある日突然ハマり、3ヶ月くらい集中的に没頭してしまいます。各カードから、そのテーマに関連する Blog の絞り込み一覧へ移動できます。',
    gridHeading: '趣味一覧',
    currentFocusLabel: '魅力・ハマった理由',
    emptyStateLabel: '関連するBlog記事は準備中',
    ctaLabel: 'Blogを見る',
  },
  en: {
    ...pageMeta.hobbies.en,
    heading: '🧸 Hobbies',
    breadcrumb: '🏠 Home / 🧸 Hobbies',
    introHeading: 'What I am Into Lately',
    introBody:
      'I sometimes get hooked on something out of nowhere and spend around three months diving into it. Each card takes you to a filtered list of blog posts related to that topic.',
    gridHeading: 'Hobby List',
    currentFocusLabel: "Why I'm Into It",
    emptyStateLabel: 'Related blog posts are coming soon',
    ctaLabel: 'Open Blog',
  },
};
