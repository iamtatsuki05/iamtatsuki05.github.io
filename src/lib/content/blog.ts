import path from 'node:path';
import { shouldIncludeDrafts } from '@/lib/config/env';
import { BlogFrontmatter } from './types';
import { parseMarkdownFile, slugFromFilename } from './markdown';
import { loadCollection } from './loader';
import { cached } from '@/lib/server/cache';
import { safeParseLocalized } from '@/lib/validation/zodI18n';
import type { Locale } from '@/lib/i18n';

const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blogs');
const GENERATED_BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'generated', 'blogs');

export type BlogPost = {
  slug: string;
  locale?: Locale;
  title: string;
  date: string;
  updated?: string;
  tags: string[];
  summary: string;
  thumbnail?: string;
  headerImage?: string;
  headerAlt?: string;
  aiAssisted?: boolean;
  draft?: boolean;
  html?: string;
  headings?: { id: string; title: string; level: number }[];
  markdown?: string;
  isAiTranslated?: boolean;
  originalPath?: string;
};

function blogDirForLocale(locale: Locale) {
  return locale === 'ja' ? BLOG_DIR : path.join(GENERATED_BLOG_DIR, locale);
}

function enrichPost(post: Omit<BlogPost, 'locale' | 'isAiTranslated' | 'originalPath'>, locale: Locale): BlogPost {
  return {
    ...post,
    locale,
    isAiTranslated: locale !== 'ja',
    originalPath: `/blogs/${post.slug}/`,
  };
}

export async function getAllPosts(locale: Locale = 'ja'): Promise<BlogPost[]> {
  const includeDrafts = shouldIncludeDrafts();
  const cacheKey = `blog:all:${locale}:${includeDrafts ? 'drafts' : 'public'}`;
  return loadCollection<BlogPost>({
    dir: blogDirForLocale(locale),
    cacheKey,
    parse: async (full, filename) => {
      const { data } = await parseMarkdownFile(full);
      const parsed = safeParseLocalized(BlogFrontmatter, data);
      if (!parsed.success) return null;
      const fm = parsed.data;
      if (fm.draft && !includeDrafts) return null;
      return enrichPost({
        slug: slugFromFilename(filename),
        title: fm.title,
        date: fm.date,
        updated: fm.updated,
        tags: fm.tags,
        summary: fm.summary || '',
        thumbnail: fm.thumbnail,
        headerImage: fm.headerImage,
        headerAlt: fm.headerAlt,
        aiAssisted: fm.aiAssisted,
        draft: fm.draft,
      }, locale);
    },
    sort: (a, b) => (a.date < b.date ? 1 : -1),
  });
}

export async function getLatestPosts(n: number, locale: Locale = 'ja') {
  const items = (await getAllPosts(locale)).slice(0, n);
  return { items };
}

export async function getPostBySlug(slug: string, locale: Locale = 'ja'): Promise<BlogPost | null> {
  const includeDrafts = shouldIncludeDrafts();
  const cacheKey = `blog:detail:${locale}:${slug}:${includeDrafts ? 'drafts' : 'public'}`;
  return cached(cacheKey, async () => {
    const full = path.join(blogDirForLocale(locale), `${slug}.md`);
    try {
      const { data, contentHtml, headings, raw } = await parseMarkdownFile(full);
      const parsed = safeParseLocalized(BlogFrontmatter, data);
      if (!parsed.success) return null;
      const fm = parsed.data;
      if (fm.draft && !includeDrafts) return null;
      return enrichPost({
        slug,
        title: fm.title,
        date: fm.date,
        updated: fm.updated,
        tags: fm.tags,
        summary: fm.summary || '',
        thumbnail: fm.thumbnail,
        headerImage: fm.headerImage,
        headerAlt: fm.headerAlt,
        aiAssisted: fm.aiAssisted,
        draft: fm.draft,
        html: contentHtml,
        headings,
        markdown: raw,
      }, locale);
    } catch {
      return null;
    }
  });
}
