import type { Locale } from '@/lib/i18n';

export const SUPPORTED_LOCALES: Locale[] = ['ja', 'en'];

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
    metadataTitle: 'ブログ記事一覧',
    metadataDescription: '岡田 龍樹による自然言語処理や機械学習に関するブログ記事の一覧です。',
    path: '/ja/blogs/',
    heading: '📝 ブログ',
    breadcrumb: '🏠 Home / 📝 ブログ',
  },
  en: {
    metadataTitle: 'Blog Posts',
    metadataDescription:
      'Browse blog posts by Tatsuki Okada about natural language processing, machine learning, and development.',
    path: '/en/blogs/',
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
    metadataTitle: 'リンク集',
    metadataDescription: 'SNSアカウントやプロジェクトなど、岡田 龍樹に関連する外部リンクをまとめています。',
    path: '/ja/links/',
    heading: '🔗 リンク',
    breadcrumb: '🏠 Home / 🔗 リンク',
    groupFallback: 'その他',
    moreLabel: 'さらに表示',
  },
  en: {
    metadataTitle: 'Links',
    metadataDescription:
      "A curated list of Tatsuki Okada social accounts, projects, and recommended resources.",
    path: '/en/links/',
    heading: '🔗 Links',
    breadcrumb: '🏠 Home / 🔗 Links',
    groupFallback: 'Other',
    moreLabel: 'See more',
  },
};

export type PublicationsPageCopy = PageCopy;

export const publicationsPageCopy: Record<Locale, PublicationsPageCopy> = {
  ja: {
    metadataTitle: '公開物',
    metadataDescription: '研究論文や記事、登壇資料など、岡田龍樹が携わった公開物の一覧です。',
    path: '/ja/publications/',
    heading: '📚 公開物',
    breadcrumb: '🏠 Home / 📚 公開物',
  },
  en: {
    metadataTitle: 'Publications',
    metadataDescription:
      'Academic publications, articles, and talks by Tatsuki Okada in the field of NLP and machine learning.',
    path: '/en/publications/',
    heading: '📚 Publications',
    breadcrumb: '🏠 Home / 📚 Publications',
  },
};

export function resolveLocale(raw: string): Locale {
  return raw === 'en' ? 'en' : 'ja';
}
