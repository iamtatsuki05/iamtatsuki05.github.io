import type { Metadata } from 'next';
import { withBasePath } from '@/lib/url';
import type { Locale } from '@/lib/i18n';
import { getSiteUrl } from '@/lib/config/env';

export const siteConfig = {
  owner: 'Tatsuki Okada',
  aliases: ['岡田 龍樹', 'Tatsuki Okada', 'iamtatsuki05', 'iam_tatsuki05'],
  siteName: {
    ja: '岡田 龍樹 | Tatsuki Okada',
    en: 'Tatsuki Okada | 岡田 龍樹',
  } satisfies Record<Locale, string>,
  defaultTitle: {
    ja: '岡田 龍樹(Tatsuki Okada) | NLP・機械学習エンジニア',
    en: 'Tatsuki Okada(岡田 龍樹) | NLP & Machine Learning Engineer',
  } satisfies Record<Locale, string>,
  description: {
    ja: '自然言語処理・機械学習・ソフトウェア開発に取り組むエンジニア、岡田 龍樹のポートフォリオサイト。最新のブログ、研究成果、制作物、活動記録をまとめています。',
    en: 'Portfolio site of Tatsuki Okada, an engineer working on NLP, machine learning, and software projects. Explore recent blog posts, publications, and side projects.',
  } satisfies Record<Locale, string>,
  keywords: {
    ja: ['岡田 龍樹', 'Tatsuki Okada', 'iamtatsuki05', 'iam_tatsuki05', '自然言語処理', '機械学習', 'ソフトウェアエンジニア', 'ポートフォリオ', '研究'],
    en: ['Tatsuki Okada', '岡田 龍樹', 'iamtatsuki05', 'iam_tatsuki05', 'NLP engineer', 'machine learning', 'software engineer', 'portfolio', 'research'],
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
    name: 'Shibaura Institute of Technology, Sugimoto Laboratory',
    url: 'http://www.lang.ise.shibaura-it.ac.jp/',
  },
  twitterHandle: '@iam_tatsuki05',
  defaultOgImage: '/favicon.ico',
} as const;

export const defaultLanguageAlternates: Record<string, string> = {
  'ja-JP': '/ja/',
  'en-US': '/en/',
  'x-default': '/',
};

type Alternates = Record<string, string>;

type BuildMetadataOptions = {
  title: string;
  description?: string;
  locale?: Locale;
  path?: string;
  type?: 'website' | 'article';
  images?: string[];
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

function resolveImages(candidates?: string[]) {
  const list = candidates?.length ? candidates : [siteConfig.defaultOgImage];
  return list
    .filter((src): src is string => Boolean(src))
    .map((src) => absoluteUrl(src));
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
}: BuildMetadataOptions): Metadata {
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

  const metadata: Metadata = {
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
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
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
    alternateName: siteConfig.aliases,
    jobTitle: ['NLP Engineer', 'Machine Learning Engineer', 'Software Engineer'],
    email: `mailto:${siteConfig.contactEmail}`,
    image: absoluteUrl(siteConfig.defaultOgImage),
    url: absoluteUrl('/'),
    sameAs: Object.values(siteConfig.socials),
    worksFor: {
      '@type': 'CollegeOrUniversity',
      name: siteConfig.affiliation.name,
      url: siteConfig.affiliation.url,
    },
    knowsAbout: ['Natural Language Processing', 'Machine Learning', 'Software Development'],
  };
}

export function buildWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName.ja,
    alternateName: siteConfig.aliases,
    url: absoluteUrl('/'),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${absoluteUrl('/blogs/')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
