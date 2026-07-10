import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';

describe('content/blog', () => {
  it('loads blog posts from content directory', async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty('slug');
  });
  it('loads a specific post by slug with html', async () => {
    const posts = await getAllPosts();
    const post = await getPostBySlug(posts[0].slug);
    expect(post?.html).toBeTypeOf('string');
    expect(post?.markdown).toContain('---');
  });

  it('loads translated blog posts by locale without changing the original slug', async () => {
    const posts = await getAllPosts('fr');
    const post = await getPostBySlug('2026-05-24-next-to-astro-with-ai', 'fr');

    expect(posts.map((item) => item.slug)).toContain('2026-05-24-next-to-astro-with-ai');
    expect(post?.locale).toBe('fr');
    expect(post?.isAiTranslated).toBe(true);
    expect(post?.originalPath).toBe('/blogs/2026-05-24-next-to-astro-with-ai/');
    expect(post?.title).toContain('Astro');
    expect(post?.html).toContain('Codex');
  });

  it('includes plain searchText for list search', async () => {
    const posts = await getAllPosts();
    for (const post of posts) {
      expect(post.searchText).toBeTypeOf('string');
      expect(post.searchText?.length).toBeGreaterThan(0);
      expect(post.searchText?.length).toBeLessThanOrEqual(4000);
      expect(post.searchText).not.toContain('```');
      expect(post.searchText).not.toContain('https://');
    }
  });

  it('loads AI-assisted blog metadata', async () => {
    const post = await getPostBySlug('2026-05-24-bonsai-dotfiles-ai-agent-era');
    const translated = await getPostBySlug('2026-05-24-bonsai-dotfiles-ai-agent-era', 'en');

    expect(post?.aiAssisted).toBe(true);
    expect(translated?.aiAssisted).toBe(true);
  });
});
