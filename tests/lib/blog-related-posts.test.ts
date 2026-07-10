import { describe, expect, it } from 'vitest';
import { selectRelatedPosts } from '@/lib/blog/relatedPosts';

const posts = [
  {
    slug: 'current',
    title: 'Current',
    date: '2026-05-24',
    tags: ['astro', 'nextjs', 'ai'],
    summary: 'current post',
  },
  {
    slug: 'two-common-tags',
    title: 'Two Common Tags',
    date: '2025-01-01',
    tags: ['astro', 'ai', 'codex'],
    summary: 'shares two tags',
  },
  {
    slug: 'one-common-newer',
    title: 'One Common Newer',
    date: '2026-01-01',
    tags: ['nextjs'],
    summary: 'shares one tag, newer',
  },
  {
    slug: 'one-common-older',
    title: 'One Common Older',
    date: '2024-01-01',
    tags: ['nextjs', 'vibecoding'],
    summary: 'shares one tag, older',
  },
  {
    slug: 'no-common-tags',
    title: 'No Common Tags',
    date: '2026-06-01',
    tags: ['dotfiles', 'nix'],
    summary: 'shares nothing',
  },
];

describe('selectRelatedPosts', () => {
  it('orders posts by common tag count, then by newest date', () => {
    const related = selectRelatedPosts(posts, 'current');
    expect(related.map((post) => post.slug)).toEqual([
      'two-common-tags',
      'one-common-newer',
      'one-common-older',
    ]);
  });

  it('excludes the current post itself', () => {
    const related = selectRelatedPosts(posts, 'current');
    expect(related.some((post) => post.slug === 'current')).toBe(false);
  });

  it('excludes posts without common tags', () => {
    const related = selectRelatedPosts(posts, 'current');
    expect(related.some((post) => post.slug === 'no-common-tags')).toBe(false);
  });

  it('limits the number of related posts', () => {
    const related = selectRelatedPosts(posts, 'current', 2);
    expect(related.map((post) => post.slug)).toEqual(['two-common-tags', 'one-common-newer']);
  });

  it('does not inflate the common tag count with duplicated tags', () => {
    const withDuplicates = [
      { slug: 'current', title: 'Current', date: '2026-05-24', tags: ['ai', 'ai'], summary: '' },
      { slug: 'duplicated', title: 'Duplicated', date: '2024-01-01', tags: ['ai', 'ai'], summary: '' },
      { slug: 'two-tags', title: 'Two Tags', date: '2023-01-01', tags: ['ai', 'astro'], summary: '' },
    ];
    const current = [...withDuplicates, { slug: 'astro-too', title: 'Astro Too', date: '2026-05-24', tags: ['ai', 'astro'], summary: '' }];
    const related = selectRelatedPosts(current, 'astro-too');
    expect(related.map((post) => post.slug)).toEqual(['two-tags', 'current', 'duplicated']);
  });

  it('returns an empty array when no post shares a tag', () => {
    const isolated = [
      { slug: 'a', title: 'A', date: '2026-01-01', tags: ['x'], summary: '' },
      { slug: 'b', title: 'B', date: '2026-01-02', tags: ['y'], summary: '' },
    ];
    expect(selectRelatedPosts(isolated, 'a')).toEqual([]);
  });

  it('returns an empty array when the current post is missing or has no tags', () => {
    expect(selectRelatedPosts(posts, 'unknown-slug')).toEqual([]);
    const untagged = [
      { slug: 'a', title: 'A', date: '2026-01-01', tags: [], summary: '' },
      { slug: 'b', title: 'B', date: '2026-01-02', tags: ['y'], summary: '' },
    ];
    expect(selectRelatedPosts(untagged, 'a')).toEqual([]);
  });
});
