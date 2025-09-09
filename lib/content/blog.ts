import fs from 'node:fs/promises';
import path from 'node:path';
import { BlogFrontmatter } from './types';
import { parseMarkdownFile, slugFromFilename } from './markdown';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blogs');

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

function includeDrafts() {
  return process.env.INCLUDE_DRAFTS === 'true';
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const files = await fs.readdir(BLOG_DIR);
  const mdFiles = files.filter((f) => f.endsWith('.md'));
  const posts: BlogPost[] = [];
  for (const f of mdFiles) {
    const full = path.join(BLOG_DIR, f);
    const { data } = await parseMarkdownFile(full);
    const parsed = BlogFrontmatter.safeParse(data);
    if (!parsed.success) continue;
    const fm = parsed.data;
    if (fm.draft && !includeDrafts()) continue;
    posts.push({
      slug: slugFromFilename(f),
      title: fm.title,
      date: fm.date,
      updated: fm.updated,
      tags: fm.tags,
      summary: fm.summary || '',
      thumbnail: fm.thumbnail,
      headerImage: fm.headerImage,
      headerAlt: fm.headerAlt,
      draft: fm.draft,
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getLatestPosts(n: number) {
  const items = (await getAllPosts()).slice(0, n);
  return { items };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const full = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const { data, contentHtml, headings } = await parseMarkdownFile(full);
    const parsed = BlogFrontmatter.safeParse(data);
    if (!parsed.success) return null;
    const fm = parsed.data;
    if (fm.draft && !includeDrafts()) return null;
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
    };
  } catch {
    return null;
  }
}
