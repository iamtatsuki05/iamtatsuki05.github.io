import { describe, expect, it } from 'vitest';
import imageLoader from '@/image-loader';

describe('imageLoader', () => {
  it('selects the nearest generated optimizer image for hobby WebP thumbnails', () => {
    const src = '/images/hobbies/nextImageExportOptimizer/gadgets-opt-1200.WEBP';

    expect(imageLoader({ src, width: 384 })).toBe('/images/hobbies/nextImageExportOptimizer/gadgets-opt-384.WEBP');
    expect(imageLoader({ src, width: 900 })).toBe('/images/hobbies/nextImageExportOptimizer/gadgets-opt-1080.WEBP');
  });

  it('preserves non-optimizer images with cacheable width and quality hints', () => {
    expect(imageLoader({ src: '/images/hobbies/bowling.svg', width: 384, quality: 80 })).toBe(
      '/images/hobbies/bowling.svg?w=384&q=80',
    );
  });
});
