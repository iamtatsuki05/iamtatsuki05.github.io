import type { Locale } from '@/lib/i18n';
import { siteConfig } from '@/lib/seo';

export type PageKey = 'home' | 'blogs' | 'links' | 'publications';

export type PageMeta = {
  metadataTitle: string;
  metadataDescription: string;
  path: string;
};

export const pageMeta: Record<PageKey, Record<Locale, PageMeta>> = {
  home: {
    ja: {
      metadataTitle: siteConfig.defaultTitle.ja,
      metadataDescription: siteConfig.description.ja,
      path: '/',
    },
    en: {
      metadataTitle: siteConfig.defaultTitle.en,
      metadataDescription: siteConfig.description.en,
      path: '/en-US/',
    },
  },
  blogs: {
    ja: {
      metadataTitle: 'ブログ記事一覧',
      metadataDescription: '岡田 龍樹による自然言語処理や機械学習に関するブログ記事の一覧です。',
      path: '/ja-JP/blogs/',
    },
    en: {
      metadataTitle: 'Blog Posts',
      metadataDescription:
        'Browse blog posts by Tatsuki Okada about natural language processing, machine learning, and development.',
      path: '/en-US/blogs/',
    },
  },
  links: {
    ja: {
      metadataTitle: 'リンク集',
      metadataDescription: 'SNSアカウントやプロジェクトなど、岡田 龍樹に関連する外部リンクをまとめています。',
      path: '/ja-JP/links/',
    },
    en: {
      metadataTitle: 'Links',
      metadataDescription: "A curated list of Tatsuki Okada social accounts, projects, and recommended resources.",
      path: '/en-US/links/',
    },
  },
  publications: {
    ja: {
      metadataTitle: '公開物',
      metadataDescription: '研究論文や記事、登壇資料など、岡田龍樹が携わった公開物の一覧です。',
      path: '/ja-JP/publications/',
    },
    en: {
      metadataTitle: 'Publications',
      metadataDescription:
        'Academic publications, articles, and talks by Tatsuki Okada in the field of NLP and machine learning.',
      path: '/en-US/publications/',
    },
  },
};

export function getPageMeta(page: PageKey, locale: Locale): PageMeta {
  return pageMeta[page][locale];
}
