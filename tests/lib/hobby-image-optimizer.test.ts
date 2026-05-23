import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { generateHobbyOptimizedImages } from '../../scripts/generate-hobby-optimized-images';

describe('generateHobbyOptimizedImages', () => {
  it('generates the WebP widths referenced by hobby thumbnails', async () => {
    const outputDir = await mkdtemp(path.join(tmpdir(), 'hobby-optimizer-'));

    try {
      const generated = await generateHobbyOptimizedImages({
        publicDir: path.join(process.cwd(), 'public'),
        outputDir,
        widths: [384, 1200],
      });

      expect(generated.map((file) => path.basename(file)).sort()).toEqual([
        'camera-opt-1200.WEBP',
        'camera-opt-384.WEBP',
        'cute-characters-opt-1200.WEBP',
        'cute-characters-opt-384.WEBP',
        'gadgets-opt-1200.WEBP',
        'gadgets-opt-384.WEBP',
        'tomoo-opt-1200.WEBP',
        'tomoo-opt-384.WEBP',
      ]);
    } finally {
      await rm(outputDir, { force: true, recursive: true });
    }
  });
});
