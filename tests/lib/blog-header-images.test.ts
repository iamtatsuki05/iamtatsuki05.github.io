import { describe, expect, it } from 'vitest';
import { buildOptimizedBlogHeaderImage } from '@/lib/content/blogHeaderImages';

describe('buildOptimizedBlogHeaderImage', () => {
  it('builds src and srcSet from a manifest entry', () => {
    const result = buildOptimizedBlogHeaderImage({
      prefix: '/images/blog-headers/abc123-',
      widths: [480, 960, 1440],
      width: 1600,
      height: 900,
    });

    expect(result).toEqual({
      src: '/images/blog-headers/abc123-w1440.webp',
      srcSet:
        '/images/blog-headers/abc123-w480.webp 480w, /images/blog-headers/abc123-w960.webp 960w, /images/blog-headers/abc123-w1440.webp 1440w',
    });
  });

  it('returns null when no widths are available', () => {
    expect(
      buildOptimizedBlogHeaderImage({ prefix: '/images/blog-headers/abc123-', widths: [], width: 0, height: 0 }),
    ).toBeNull();
  });
});
