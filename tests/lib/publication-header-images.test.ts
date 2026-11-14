import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllPublications } from '@/lib/content/publication';

describe('publication header images', () => {
  it('points every site-hosted headerImage at a file under public/', async () => {
    const publications = await getAllPublications();
    const local = publications.filter((pub) => pub.headerImage?.startsWith('/'));

    expect(local.map((pub) => pub.slug)).toEqual(
      expect.arrayContaining([
        'app-binaural-beats-generator',
        'app-meal-shield',
        'app-ocr-translate-en2jp',
        'app-unlock-pdf-password',
      ]),
    );
    for (const pub of local) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', pub.headerImage as string)), pub.slug).toBe(true);
    }
  });
});
