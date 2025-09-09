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
  });
});

