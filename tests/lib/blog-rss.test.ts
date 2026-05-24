import { describe, expect, it } from 'vitest';
import { buildBlogRssDescription } from '@/lib/blog/rss';
import type { BlogPost } from '@/lib/content/blog';

const basePost: BlogPost = {
  slug: 'sample-post',
  title: 'Sample',
  date: '2026-05-24',
  tags: [],
  summary: 'Summary text.',
};

describe('blog RSS descriptions', () => {
  it('adds AI-writing notice for Japanese AI-assisted posts', () => {
    const description = buildBlogRssDescription({ ...basePost, aiAssisted: true }, 'ja', 'https://example.com');

    expect(description).toContain('この記事は AI の補助を使って執筆しています。');
    expect(description).toContain('Summary text.');
  });

  it('adds both translation and AI-writing notices for localized AI-assisted posts', () => {
    const description = buildBlogRssDescription({ ...basePost, aiAssisted: true }, 'en', 'https://example.com');

    expect(description).toContain('This article was translated by AI.');
    expect(description).toContain('Read the Japanese original: https://example.com/blogs/sample-post/');
    expect(description).toContain('This article was written with AI assistance.');
    expect(description).toContain('Summary text.');
  });
});
