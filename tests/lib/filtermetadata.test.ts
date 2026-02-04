import { describe, expect, it } from 'vitest';
import { buildOrderedFacetValues, buildSearchFilterMetadata } from '@/lib/search/filterMetadata';

describe('buildSearchFilterMetadata', () => {
  it('collects years and tags from item metadata', () => {
    const metadata = buildSearchFilterMetadata(
      [
        { publishedAt: '2025-01-01', tags: ['nlp', 'llm'] },
        { publishedAt: '2024-12', tags: ['llm', 'vision'] },
        { publishedAt: undefined, tags: [] },
      ],
      {
        extractYear: (item) => item.publishedAt,
        extractTags: (item) => item.tags,
      },
    );

    expect(metadata.years).toEqual(['2025', '2024']);
    expect(metadata.tags).toEqual(['llm', 'nlp', 'vision']);
  });
});

describe('buildOrderedFacetValues', () => {
  it('keeps configured order while returning only values present in metadata', () => {
    const values = buildOrderedFacetValues(
      [
        { type: 'paper' as const },
        { type: 'article' as const },
      ],
      (item) => item.type,
      ['paper', 'app', 'article', 'talk'] as const,
    );

    expect(values).toEqual(['paper', 'article']);
  });
});
