import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { PublicationFrontmatter, parseFrontmatter } from './types';
import { loadCollection } from './loader';

const PUB_DIR = path.join(process.cwd(), 'src', 'content', 'publications');

export type Publication = PublicationFrontmatter & { slug: string };

export async function getAllPublications(): Promise<Publication[]> {
  return loadCollection<Publication>({
    dir: PUB_DIR,
    cacheKey: 'publications:all',
    parse: async (full, filename) => {
      const raw = await fs.readFile(full, 'utf8');
      const { data } = matter(raw);
      const fm = parseFrontmatter(PublicationFrontmatter, data, full);
      return { ...fm, slug: filename.replace(/\.mdx?$/, '') };
    },
    sort: (a, b) => ((a.publishedAt || '') < (b.publishedAt || '') ? 1 : -1),
  });
}
