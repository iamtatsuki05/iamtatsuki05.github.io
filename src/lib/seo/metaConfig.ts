import type { Locale } from '@/lib/i18n';
import { siteConfig } from './config';

export type PageKey = 'home' | 'blogs' | 'links' | 'publications' | 'hobbies';

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
    zh: {
      metadataTitle: siteConfig.defaultTitle.zh,
      metadataDescription: siteConfig.description.zh,
      path: '/zh-CN/',
    },
    fr: {
      metadataTitle: siteConfig.defaultTitle.fr,
      metadataDescription: siteConfig.description.fr,
      path: '/fr-FR/',
    },
  },
  blogs: {
    ja: {
      metadataTitle: 'ブログ記事一覧',
      metadataDescription: '岡田 龍樹による自然言語処理や機械学習に関するブログ記事の一覧です。',
      path: '/ja-JP/blogs/',
    },
    en: {
      metadataTitle: 'Blogs',
      metadataDescription:
        'Browse blog posts by Tatsuki Okada about natural language processing, machine learning, and development.',
      path: '/en-US/blogs/',
    },
    zh: {
      metadataTitle: '博客',
      metadataDescription: '浏览冈田龙树关于自然语言处理、机器学习和开发的博客文章。',
      path: '/zh-CN/blogs/',
    },
    fr: {
      metadataTitle: 'Articles',
      metadataDescription:
        'Parcourez les articles de Tatsuki Okada sur le NLP, le machine learning et le développement.',
      path: '/fr-FR/blogs/',
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
    zh: {
      metadataTitle: '链接',
      metadataDescription: '冈田龙树的社交账号、项目和相关资源链接。',
      path: '/zh-CN/links/',
    },
    fr: {
      metadataTitle: 'Liens',
      metadataDescription: 'Une sélection de comptes sociaux, projets et ressources liés à Tatsuki Okada.',
      path: '/fr-FR/links/',
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
    zh: {
      metadataTitle: '公开成果',
      metadataDescription: '冈田龙树参与的研究论文、文章和演讲资料。',
      path: '/zh-CN/publications/',
    },
    fr: {
      metadataTitle: 'Publications',
      metadataDescription:
        'Publications académiques, articles et présentations de Tatsuki Okada dans le NLP et le machine learning.',
      path: '/fr-FR/publications/',
    },
  },
  hobbies: {
    ja: {
      metadataTitle: '趣味',
      metadataDescription: 'ガジェット、NLP、チャイ、ピアノなど、岡田龍樹の趣味と最近ハマっていることをまとめています。',
      path: '/ja-JP/hobbies/',
    },
    en: {
      metadataTitle: 'Hobbies',
      metadataDescription:
        'A collection of Tatsuki Okada hobbies and current obsessions, from gadgets and NLP to chai, piano, and visual works.',
      path: '/en-US/hobbies/',
    },
    zh: {
      metadataTitle: '兴趣',
      metadataDescription: '冈田龙树的兴趣和最近投入的主题，包括数码产品、NLP、印度奶茶、钢琴和影像作品。',
      path: '/zh-CN/hobbies/',
    },
    fr: {
      metadataTitle: 'Centres d’intérêt',
      metadataDescription:
        'Les hobbies et sujets du moment de Tatsuki Okada, des gadgets et du NLP au chai, au piano et aux œuvres visuelles.',
      path: '/fr-FR/hobbies/',
    },
  },
};
