import type { Locale } from '@/lib/i18n';

export const siteConfig = {
  owner: 'Tatsuki Okada',
  aliases: ['岡田 龍樹', 'Tatsuki Okada', 'iamtatsuki05', 'iam_tatsuki05'],
  siteName: {
    ja: '岡田 龍樹 | Tatsuki Okada',
    en: 'Tatsuki Okada | 岡田 龍樹',
    zh: 'Tatsuki Okada | 岡田 龍樹',
    fr: 'Tatsuki Okada | 岡田 龍樹',
  } satisfies Record<Locale, string>,
  defaultTitle: {
    ja: 'NLP・機械学習エンジニア',
    en: 'NLP & Machine Learning Engineer',
    zh: '自然语言处理与机器学习工程师',
    fr: 'Ingénieur NLP et machine learning',
  } satisfies Record<Locale, string>,
  description: {
    ja: '自然言語処理・機械学習・ソフトウェア開発に取り組むエンジニア、岡田 龍樹のポートフォリオサイト。最新のブログ、研究成果、制作物、活動記録をまとめています。',
    en: 'Portfolio site of Tatsuki Okada, an engineer working on NLP, machine learning, and software projects. Explore recent blog posts, publications, and side projects.',
    zh: '冈田龙树的作品集网站。他是一名从事自然语言处理、机器学习和软件开发的工程师。这里整理了最新博客、研究成果和个人项目。',
    fr: 'Site portfolio de Tatsuki Okada, ingénieur travaillant sur le NLP, le machine learning et des projets logiciels. Vous y trouverez ses articles récents, publications et projets personnels.',
  } satisfies Record<Locale, string>,
  keywords: {
    ja: ['岡田 龍樹', 'Tatsuki Okada', 'iamtatsuki05', 'iam_tatsuki05', '自然言語処理', '機械学習', 'ソフトウェアエンジニア', 'ポートフォリオ', '研究'],
    en: ['Tatsuki Okada', '岡田 龍樹', 'iamtatsuki05', 'iam_tatsuki05', 'NLP engineer', 'machine learning', 'software engineer', 'portfolio', 'research'],
    zh: ['Tatsuki Okada', '岡田 龍樹', 'iamtatsuki05', 'iam_tatsuki05', '自然语言处理', '机器学习', '软件工程师', '作品集', '研究'],
    fr: ['Tatsuki Okada', '岡田 龍樹', 'iamtatsuki05', 'iam_tatsuki05', 'ingénieur NLP', 'machine learning', 'ingénieur logiciel', 'portfolio', 'recherche'],
  } satisfies Record<Locale, string[]>,
  contactEmail: 'tatsukio0522@gmail.com',
  socials: {
    github: 'https://github.com/iamtatsuki05',
    x: 'https://x.com/iam_tatsuki05',
    instagram: 'https://www.instagram.com/iam_tatsuki05',
    linkedin: 'https://www.linkedin.com/in/iamtatsuki05',
    huggingface: 'https://huggingface.co/iamtatsuki05',
  },
  affiliation: {
    institution: {
      name: 'Nara Institute of Science and Technology (NAIST)',
      url: 'https://www.naist.jp/en/',
    },
    laboratory: {
      name: 'Natural Language Processing Laboratory (Watanabe Lab), Graduate School of Science and Technology, Information Science',
      url: 'https://nlp.naist.jp/en/',
    },
  },
  twitterHandle: '@iam_tatsuki05',
  defaultOgImage: '/favicon.ico',
} as const;
