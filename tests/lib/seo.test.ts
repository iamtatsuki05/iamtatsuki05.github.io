import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { buildArticleJsonLd, buildLanguageAlternates, buildOrganizationJsonLd, buildPageMetadata, buildPersonJsonLd } from '@/lib/seo';

const ORIGINAL_SITE_URL = process.env.SITE_URL;

beforeEach(() => {
  process.env.SITE_URL = 'https://example.com';
});

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = ORIGINAL_SITE_URL;
  }
});

describe('buildPageMetadata', () => {
  it('resolves canonical URL, alternates and default images', () => {
    const metadata = buildPageMetadata({
      title: 'Test Page',
      description: 'Testing metadata helper',
      locale: 'en',
      path: '/test/',
      keywords: ['custom'],
      languageAlternates: {
        'en-US': '/test/',
        'ja-JP': '/ja-JP/test/',
      },
    });

    expect(metadata.alternates?.canonical).toBe('https://example.com/test/');
    expect(metadata.alternates?.languages?.['ja-JP']).toBe('https://example.com/ja-JP/test/');
    expect(metadata.openGraph?.images?.[0]).toEqual({ url: 'https://example.com/favicon.ico' });
    expect(metadata.twitter?.images?.[0]).toEqual({ url: 'https://example.com/favicon.ico' });
    expect(metadata.keywords).toContain('custom');
  });
});

describe('buildLanguageAlternates', () => {
  it('locale付きパスから各言語のhreflangを生成する', () => {
    const alternates = buildLanguageAlternates('/ja-JP/blogs/');

    expect(alternates['ja-JP']).toBe('/ja-JP/blogs/');
    expect(alternates['en-US']).toBe('/en-US/blogs/');
    expect(alternates['x-default']).toBe('/blogs/');
  });
});

describe('buildArticleJsonLd', () => {
  it('generates BlogPosting schema with absolute image URL', () => {
    const article = buildArticleJsonLd({
      title: 'Structured Data',
      description: 'How structured data improves SEO.',
      path: '/blogs/structured-data/',
      image: '/images/og-sample.jpg',
      datePublished: '2024-03-01T00:00:00Z',
      tags: ['seo'],
    });

    expect(article['@type']).toBe('BlogPosting');
    expect(article.url).toBe('https://example.com/blogs/structured-data/');
    expect(article.image?.[0]).toBe('https://example.com/images/og-sample.jpg');
    expect(article.publisher?.logo?.url).toBe('https://example.com/favicon.ico');
    expect(article.keywords).toEqual(['seo']);
  });
});

describe('structured profile metadata', () => {
  it('includes the NLP laboratory under the university affiliation', () => {
    const person = buildPersonJsonLd();

    expect(person.worksFor?.['@type']).toBe('Organization');
    expect(person.worksFor?.name).toBe(
      'Natural Language Processing Laboratory (Watanabe Laboratory), Division of Information Science',
    );
    expect(person.worksFor?.url).toBe('https://nlp.naist.jp/en/');
    expect(person.worksFor?.parentOrganization?.['@type']).toBe('CollegeOrUniversity');
    expect(person.worksFor?.parentOrganization?.name).toBe('Nara Institute of Science and Technology (NAIST)');
    expect(person.worksFor?.parentOrganization?.url).toBe('https://www.naist.jp/en/');
  });

  it('reuses the same affiliation in the profile page schema', () => {
    const profile = buildOrganizationJsonLd();

    expect(profile.mainEntity.worksFor?.name).toBe(
      'Natural Language Processing Laboratory (Watanabe Laboratory), Division of Information Science',
    );
    expect(profile.mainEntity.worksFor?.parentOrganization?.name).toBe(
      'Nara Institute of Science and Technology (NAIST)',
    );
  });
});
