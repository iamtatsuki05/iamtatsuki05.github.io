import { describe, expect, it } from 'vitest';
import {
  buildBlogPostHref,
  parseBlogFilterParams,
} from '@/lib/blog/navigation';
import { resolveBlogPostNavigation } from '@/lib/blog/postNavigation';

const posts = [
  {
    slug: 'newest-ai',
    title: 'Newest AI',
    date: '2025-03-01',
    tags: ['ai'],
    summary: 'common search note',
  },
  {
    slug: 'middle-ai',
    title: 'Middle AI',
    date: '2025-02-01',
    tags: ['ai'],
    summary: 'common search note',
  },
  {
    slug: 'oldest-ai',
    title: 'Oldest AI',
    date: '2024-01-01',
    tags: ['ai'],
    summary: 'common search note',
  },
  {
    slug: 'newest-life',
    title: 'Newest Life',
    date: '2025-04-01',
    tags: ['life'],
    summary: 'common search note',
  },
];

describe('blog navigation helpers', () => {
  it('parses comma separated blog filter query params', () => {
    const filters = parseBlogFilterParams({
      q: 'common',
      year: '2025,2024',
      tags: 'ai,life',
      sort: 'newest',
    });

    expect(filters).toEqual({
      q: 'common',
      year: ['2025', '2024'],
      tags: ['ai', 'life'],
      sort: 'newest',
    });
  });

  it('keeps active filters in generated post hrefs', () => {
    expect(
      buildBlogPostHref('middle-ai', {
        q: 'common',
        year: ['2025'],
        tags: ['ai'],
        sort: 'newest',
      }),
    ).toBe('/blogs/middle-ai/?q=common&year=2025&tags=ai&sort=newest');
  });

  it('resolves previous and next posts from the filtered search result order', async () => {
    const result = await resolveBlogPostNavigation(posts, 'middle-ai', {
      q: 'common',
      year: ['2025'],
      tags: ['ai'],
      sort: 'newest',
    });

    expect(result.total).toBe(2);
    expect(result.previous?.slug).toBe('newest-ai');
    expect(result.next).toBeNull();
    expect(result.previousHref).toBe('/blogs/newest-ai/?q=common&year=2025&tags=ai&sort=newest');
    expect(result.nextHref).toBeNull();
  });

  it('falls back to natural newest-first order without filters', async () => {
    const result = await resolveBlogPostNavigation(posts, 'middle-ai', {});

    expect(result.previous?.slug).toBe('newest-ai');
    expect(result.next?.slug).toBe('oldest-ai');
    expect(result.previousHref).toBe('/blogs/newest-ai/');
    expect(result.nextHref).toBe('/blogs/oldest-ai/');
  });
});
