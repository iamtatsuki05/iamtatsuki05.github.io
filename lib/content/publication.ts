import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { PublicationFrontmatter } from './types';

const PUB_DIR = path.join(process.cwd(), 'content', 'publications');

export type Publication = PublicationFrontmatter & { slug: string };

export async function getAllPublications(): Promise<Publication[]> {
  const files = await fs.readdir(PUB_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));
  const items: Publication[] = [];
  for (const f of mdFiles) {
    const full = path.join(PUB_DIR, f);
    const raw = await fs.readFile(full, 'utf8');
    const { data } = matter(raw);
    const parsed = PublicationFrontmatter.safeParse(data);
    if (!parsed.success) continue;
    items.push({ ...parsed.data, slug: f.replace(/\.md$/, '') });
  }
  items.sort((a, b) => (a.publishedAt || '') < (b.publishedAt || '') ? 1 : -1);
  return items;
}
