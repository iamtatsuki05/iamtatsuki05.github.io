import type { PaperGroupKey } from '@/lib/data/cv';
import type { Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo/metaConfig';

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
    heading: '📝 Blogs',
    breadcrumb: '🏠 Home / 📝 Blogs',
  },
  zh: {
    ...pageMeta.blogs.zh,
    heading: '📝 博客',
    breadcrumb: '🏠 首页 / 📝 博客',
  },
  fr: {
    ...pageMeta.blogs.fr,
    heading: '📝 Articles',
    breadcrumb: '🏠 Accueil / 📝 Articles',
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
  zh: {
    ...pageMeta.links.zh,
    heading: '🔗 链接',
    breadcrumb: '🏠 首页 / 🔗 链接',
    groupFallback: '其他',
    moreLabel: '查看更多',
  },
  fr: {
    ...pageMeta.links.fr,
    heading: '🔗 Liens',
    breadcrumb: '🏠 Accueil / 🔗 Liens',
    groupFallback: 'Autres',
    moreLabel: 'Voir plus',
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
  zh: {
    ...pageMeta.publications.zh,
    heading: '📚 公开成果',
    breadcrumb: '🏠 首页 / 📚 公开成果',
  },
  fr: {
    ...pageMeta.publications.fr,
    heading: '📚 Publications',
    breadcrumb: '🏠 Accueil / 📚 Publications',
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
      'ある日突然ハマり、3ヶ月くらい没頭してしまいます。各カードから、そのテーマに関連するブログの絞り込み一覧へ移動できます。',
    gridHeading: '趣味一覧',
    currentFocusLabel: '魅力・ハマった理由',
    emptyStateLabel: '関連するブログ記事は準備中',
    ctaLabel: 'ブログを見る',
  },
  en: {
    ...pageMeta.hobbies.en,
    heading: '🧸 Hobbies',
    breadcrumb: '🏠 Home / 🧸 Hobbies',
    introHeading: "What I'm Into Lately",
    introBody:
      'I sometimes get hooked on something out of nowhere and spend around three months diving into it. Each card takes you to a filtered list of blog posts related to that topic.',
    gridHeading: 'Hobby List',
    currentFocusLabel: "Why I'm Into It",
    emptyStateLabel: 'Related blog posts are coming soon',
    ctaLabel: 'See Blog Posts',
  },
  zh: {
    ...pageMeta.hobbies.zh,
    heading: '🧸 兴趣',
    breadcrumb: '🏠 首页 / 🧸 兴趣',
    introHeading: '最近投入的事情',
    introBody:
      '我有时会突然迷上某个主题，然后集中投入大约三个月。每张卡片都会打开与该主题相关的博客筛选列表。',
    gridHeading: '兴趣列表',
    currentFocusLabel: '吸引我的原因',
    emptyStateLabel: '相关博客文章准备中',
    ctaLabel: '查看博客',
  },
  fr: {
    ...pageMeta.hobbies.fr,
    heading: '🧸 Centres d’intérêt',
    breadcrumb: '🏠 Accueil / 🧸 Centres d’intérêt',
    introHeading: 'Ce qui me passionne en ce moment',
    introBody:
      'Il m’arrive de me passionner soudainement pour un sujet et d’y passer environ trois mois. Chaque carte ouvre une liste filtrée d’articles liés à ce thème.',
    gridHeading: 'Liste des centres d’intérêt',
    currentFocusLabel: 'Pourquoi cela m’intéresse',
    emptyStateLabel: 'Les articles associés arrivent bientôt',
    ctaLabel: 'Voir les articles',
  },
};

export type CvPageCopy = PageCopy<{
  sections: {
    education: string;
    experience: string;
    publications: string;
    others: string;
    software: string;
    grants: string;
    awards: string;
  };
  paperGroups: Record<PaperGroupKey, string>;
  present: string;
}>;

export const cvPageCopy: Record<Locale, CvPageCopy> = {
  ja: {
    ...pageMeta.cv.ja,
    heading: '📄 CV',
    breadcrumb: '🏠 Home / 📄 CV',
    sections: {
      education: '🎓 学歴',
      experience: '💼 職歴',
      publications: '📚 論文',
      others: '📝 記事・その他',
      software: '🛠 ソフトウェア',
      grants: '💰 奨学金・助成',
      awards: '🏆 受賞',
    },
    paperGroups: {
      'international-refereed': '国際会議（査読あり）',
      'international-nonrefereed': '国際会議（査読なし）',
      'domestic-refereed': '国内会議（査読あり）',
      'domestic-nonrefereed': '国内会議（査読なし）',
    },
    present: '現在',
  },
  en: {
    ...pageMeta.cv.en,
    heading: '📄 CV',
    breadcrumb: '🏠 Home / 📄 CV',
    sections: {
      education: '🎓 Education',
      experience: '💼 Work Experience',
      publications: '📚 Publications',
      others: '📝 Articles and Other Works',
      software: '🛠 Software',
      grants: '💰 Scholarships and Grants',
      awards: '🏆 Awards',
    },
    paperGroups: {
      'international-refereed': 'International Conferences (Refereed)',
      'international-nonrefereed': 'International Conferences (Non-refereed)',
      'domestic-refereed': 'Domestic Conferences in Japan (Refereed)',
      'domestic-nonrefereed': 'Domestic Conferences in Japan (Non-refereed)',
    },
    present: 'Present',
  },
  zh: {
    ...pageMeta.cv.zh,
    heading: '📄 简历',
    breadcrumb: '🏠 首页 / 📄 简历',
    sections: {
      education: '🎓 教育经历',
      experience: '💼 工作经历',
      publications: '📚 论文',
      others: '📝 文章及其他',
      software: '🛠 软件',
      grants: '💰 奖学金与资助',
      awards: '🏆 获奖',
    },
    paperGroups: {
      'international-refereed': '国际会议（经同行评审）',
      'international-nonrefereed': '国际会议（未经同行评审）',
      'domestic-refereed': '日本国内会议（经同行评审）',
      'domestic-nonrefereed': '日本国内会议（未经同行评审）',
    },
    present: '至今',
  },
  fr: {
    ...pageMeta.cv.fr,
    heading: '📄 CV',
    breadcrumb: '🏠 Accueil / 📄 CV',
    sections: {
      education: '🎓 Formation',
      experience: '💼 Expérience professionnelle',
      publications: '📚 Publications',
      others: '📝 Articles et autres travaux',
      software: '🛠 Logiciels',
      grants: '💰 Bourses et financements',
      awards: '🏆 Distinctions',
    },
    paperGroups: {
      'international-refereed': 'Conférences internationales (avec comité de lecture)',
      'international-nonrefereed': 'Conférences internationales (sans comité de lecture)',
      'domestic-refereed': 'Conférences au Japon (avec comité de lecture)',
      'domestic-nonrefereed': 'Conférences au Japon (sans comité de lecture)',
    },
    present: 'aujourd’hui',
  },
};
