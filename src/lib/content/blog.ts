import fs from 'node:fs/promises';
import path from 'node:path';
import { shouldIncludeDrafts } from '@/lib/config/env';
import { cached } from '@/lib/server/cache';
import { BlogFrontmatter } from './types';
import { parseMarkdownFile, slugFromFilename } from './markdown';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blogs');

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  summary: string;
  thumbnail?: string;
  headerImage?: string;
  headerAlt?: string;
  draft?: boolean;
  html?: string;
  headings?: { id: string; title: string; level: number }[];
};

export async function getAllPosts(): Promise<BlogPost[]> {
  const includeDrafts = shouldIncludeDrafts();
  const cacheKey = `blog:all:${includeDrafts ? 'drafts' : 'public'}`;
  return cached(cacheKey, async () => {
    const files = await fs.readdir(BLOG_DIR);
    const mdFiles = files.filter((f) => f.endsWith('.md'));
    const posts = await Promise.all<BlogPost | null>(
      mdFiles.map(async (filename) => {
        const full = path.join(BLOG_DIR, filename);
        const { data } = await parseMarkdownFile(full);
        const parsed = BlogFrontmatter.safeParse(data);
        if (!parsed.success) return null;
        const fm = parsed.data;
        if (fm.draft && !includeDrafts) return null;
        return {
          slug: slugFromFilename(filename),
          title: fm.title,
          date: fm.date,
          updated: fm.updated,
          tags: fm.tags,
          summary: fm.summary || '',
          thumbnail: fm.thumbnail,
          headerImage: fm.headerImage,
          headerAlt: fm.headerAlt,
          draft: fm.draft,
        } satisfies BlogPost;
      }),
    );
    const list: BlogPost[] = posts.filter((p): p is BlogPost => p !== null);
    list.sort((a, b) => (a.date < b.date ? 1 : -1));
    return list;
  });
}

export async function getLatestPosts(n: number) {
  const items = (await getAllPosts()).slice(0, n);
  return { items };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const includeDrafts = shouldIncludeDrafts();
  const cacheKey = `blog:detail:${slug}:${includeDrafts ? 'drafts' : 'public'}`;
  return cached(cacheKey, async () => {
    const full = path.join(BLOG_DIR, `${slug}.md`);
    try {
      const { data, contentHtml, headings } = await parseMarkdownFile(full);
      const parsed = BlogFrontmatter.safeParse(data);
      if (!parsed.success) return null;
      const fm = parsed.data;
      if (fm.draft && !includeDrafts) return null;
      return {
        slug,
        title: fm.title,
        date: fm.date,
        updated: fm.updated,
        tags: fm.tags,
        summary: fm.summary || '',
        thumbnail: fm.thumbnail,
        headerImage: fm.headerImage,
        headerAlt: fm.headerAlt,
        draft: fm.draft,
        html: contentHtml,
        headings,
      } satisfies BlogPost;
    } catch {
      return null;
    }
  });
}
