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
      'ある日突然ハマり、3ヶ月くらい集中的に没頭してしまいます。各カードから、そのテーマに関連するブログの絞り込み一覧へ移動できます。',
    gridHeading: '趣味一覧',
    currentFocusLabel: '魅力・ハマった理由',
    emptyStateLabel: '関連するブログ記事は準備中',
    ctaLabel: 'ブログを見る',
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
    ctaLabel: 'Open Blogs',
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
    ctaLabel: 'Ouvrir les articles',
  },
};
