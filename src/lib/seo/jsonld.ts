import { siteConfig } from './config';
import { absoluteUrl } from './url';

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
        url: absoluteUrl(siteConfig.avatarImage),
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
    image: absoluteUrl(siteConfig.avatarImage),
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
      image: absoluteUrl(siteConfig.avatarImage),
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
