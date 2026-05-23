import { withBasePath } from '@/lib/url';
import type { Locale } from '@/lib/i18n';
import { LOCALE_LABELS, SUPPORTED_LOCALES } from '@/lib/i18n';
import { localizedPath, stripLocalePrefix } from '@/lib/routing';
import { getSiteUrl } from '@/lib/config/env';

export type PageMetadata = {
  title?: string;
  description?: string;
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
    types?: Record<string, string>;
  };
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    locale?: string;
    type?: 'website' | 'article';
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: Array<{ url: string; width?: number; height?: number; alt?: string }>;
  };
  authors?: Array<{ name: string; url?: string }>;
  creator?: string;
  publisher?: string;
};

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
      name: 'Natural Language Processing Laboratory (Watanabe Laboratory), Division of Information Science',
      url: 'https://nlp.naist.jp/en/',
    },
  },
  twitterHandle: '@iam_tatsuki05',
  defaultOgImage: '/favicon.ico',
} as const;

function buildAffiliationJsonLd() {
  return {
    '@type': 'Organization',
    name: siteConfig.affiliation.laboratory.name,
    url: siteConfig.affiliation.laboratory.url,
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: siteConfig.affiliation.institution.name,
      url: siteConfig.affiliation.institution.url,
    },
  };
}

export function buildLanguageAlternates(path: string): Record<string, string> {
  const raw = path || '/';
  const bare = stripLocalePrefix(raw);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const languages = Object.fromEntries(
    SUPPORTED_LOCALES.map((locale) => [LOCALE_LABELS[locale], localizedPath(normalized, locale)]),
  );
  return {
    ...languages,
    'x-default': normalized,
  };
}

export const defaultLanguageAlternates: Record<string, string> = buildLanguageAlternates('/');

type Alternates = Record<string, string>;

type ImageMetadata = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type BuildMetadataOptions = {
  title: string;
  description?: string;
  locale?: Locale;
  path?: string;
  type?: 'website' | 'article';
  images?: (string | ImageMetadata)[];
  keywords?: string[];
  languageAlternates?: Alternates;
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
};

export function getSiteOrigin() {
  return getSiteUrl();
}

export function absoluteUrl(input: string = '/') {
  const raw = input || '/';
  if (/^(https?:)?\/\//i.test(raw)) {
    return raw.startsWith('http') ? raw : `https:${raw}`;
  }
  const withBase = withBasePath(raw.startsWith('/') ? raw : `/${raw}`) ?? '/';
  return new URL(withBase, getSiteOrigin()).toString();
}

function resolveImages(candidates?: (string | ImageMetadata)[]) {
  const list = candidates?.length ? candidates : [siteConfig.defaultOgImage];
  return list
    .filter((item): item is string | ImageMetadata => Boolean(item))
    .map((item) => {
      if (typeof item === 'string') {
        return { url: absoluteUrl(item) };
      }
      return {
        url: absoluteUrl(item.url),
        width: item.width,
        height: item.height,
        alt: item.alt,
      };
    });
}

export function buildPageMetadata({
  title,
  description,
  locale = 'ja',
  path = '/',
  type = 'website',
  images,
  keywords = [],
  languageAlternates,
  publishedTime,
  modifiedTime,
  tags,
}: BuildMetadataOptions): PageMetadata {
  const base = siteConfig.siteName[locale] || siteConfig.siteName.ja;
  const finalTitle = title.includes(base) ? title : `${title} | ${base}`;
  const finalDescription = description || siteConfig.description[locale];
  const canonicalUrl = absoluteUrl(path);
  const ogImages = resolveImages(images);
  const mergedKeywords = Array.from(new Set([...(siteConfig.keywords[locale] || []), ...keywords]));

  const alternates = languageAlternates
    ? Object.fromEntries(
        Object.entries(languageAlternates).map(([key, value]) => [key, absoluteUrl(value)]),
      )
    : undefined;

  const metadata: PageMetadata = {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
      ...(alternates ? { languages: alternates } : {}),
    },
    keywords: mergedKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: siteConfig.siteName[locale],
      locale: {
        ja: 'ja_JP',
        en: 'en_US',
        zh: 'zh_CN',
        fr: 'fr_FR',
      }[locale],
      type,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      creator: siteConfig.twitterHandle,
      images: ogImages,
    },
    authors: [{ name: siteConfig.owner, url: absoluteUrl('/') }],
    creator: siteConfig.owner,
    publisher: siteConfig.owner,
  };

  if (type === 'article') {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: [siteConfig.owner],
      tags,
    };
    metadata.twitter = {
      ...metadata.twitter,
    };
  }

  return metadata;
}

export function buildArticleJsonLd(options: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  tags?: string[];
}) {
  const { title, description, path, image, datePublished, dateModified, tags } = options;
  const imageUrl = image ? absoluteUrl(image) : undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    url: absoluteUrl(path),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(path),
    },
    image: imageUrl ? [imageUrl] : undefined,
    author: {
      '@type': 'Person',
      name: siteConfig.owner,
      url: absoluteUrl('/'),
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.owner,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(siteConfig.defaultOgImage),
      },
    },
    keywords: tags,
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.owner,
    givenName: 'Tatsuki',
    familyName: 'Okada',
    alternateName: siteConfig.aliases,
    description: 'NLP Engineer, Machine Learning Engineer, and Software Engineer specializing in natural language processing and machine learning.',
    jobTitle: ['NLP Engineer', 'Machine Learning Engineer', 'Software Engineer'],
    email: `mailto:${siteConfig.contactEmail}`,
    image: absoluteUrl(siteConfig.defaultOgImage),
    url: absoluteUrl('/'),
    sameAs: Object.values(siteConfig.socials),
    worksFor: buildAffiliationJsonLd(),
    knowsAbout: ['Natural Language Processing', 'Machine Learning', 'Software Development'],
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName.ja,
    alternateName: siteConfig.aliases,
    description: siteConfig.description.ja,
    url: absoluteUrl('/'),
    author: {
      '@type': 'Person',
      name: siteConfig.owner,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/blogs/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildSiteLinksJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Links',
        description: 'SNSと外部リンク',
        url: absoluteUrl('/links/'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Hobbies',
        description: '趣味と最近ハマっていること',
        url: absoluteUrl('/hobbies/'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Blogs',
        description: '最新の技術ブログと記事',
        url: absoluteUrl('/blogs/'),
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Publications',
        description: '学術論文と研究成果',
        url: absoluteUrl('/publications/'),
      },
    ],
  };
}

export function buildBreadcrumbJsonLd(options?: { path?: string; items?: Array<{ name: string; url: string }> }) {
  const items = options?.items || [
    {
      name: 'Home',
      url: absoluteUrl('/'),
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      '@id': absoluteUrl('/'),
      name: siteConfig.owner,
      givenName: 'Tatsuki',
      familyName: 'Okada',
      alternateName: siteConfig.aliases,
      description: 'NLP Engineer, Machine Learning Engineer, and Software Engineer specializing in natural language processing and machine learning.',
      jobTitle: ['NLP Engineer', 'Machine Learning Engineer', 'Software Engineer'],
      email: `mailto:${siteConfig.contactEmail}`,
      image: absoluteUrl(siteConfig.defaultOgImage),
      url: absoluteUrl('/'),
      sameAs: Object.values(siteConfig.socials),
      worksFor: buildAffiliationJsonLd(),
      knowsAbout: ['Natural Language Processing', 'Machine Learning', 'Software Development'],
    },
  };
}

export function buildCollectionPageJsonLd(options: {
  path: string;
  name: string;
  description: string;
  itemCount?: number;
}) {
  const { path, name, description, itemCount } = options;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.siteName.ja,
      url: absoluteUrl('/'),
    },
    about: {
      '@type': 'Person',
      name: siteConfig.owner,
      url: absoluteUrl('/'),
    },
    ...(itemCount !== undefined ? { numberOfItems: itemCount } : {}),
  };
}
