import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeKatex from 'rehype-katex';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { Schema } from 'hast-util-sanitize';
import { cached } from '@/lib/server/cache';
import remarkLinkCard from './remark-link-card';
import rehypeImgDefaults from './rehype-img';
import rehypeExternalLinks from './rehype-external-links';
import rehypeLegacyAnchors, { parseLegacyAnchors } from './rehype-legacy-anchors';

type SanitizerAttributes = NonNullable<Schema['attributes']>;
type SanitizerAttribute = SanitizerAttributes[string][number];

function defaultAttributes(tagName: string): SanitizerAttribute[] {
  return [...((defaultSchema.attributes?.[tagName] as SanitizerAttribute[] | undefined) || [])];
}

const markdownSanitizeSchema: Schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'details',
    'summary',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [
      ...defaultAttributes('*'),
      'className',
    ],
    a: [
      ...defaultAttributes('a'),
      'target',
      'rel',
    ],
    code: [
      ...defaultAttributes('code'),
      'className',
    ],
    div: [
      ...defaultAttributes('div'),
      'className',
      ['dataProvider', 'youtube', 'twitter', 'instagram'],
      'dataUrl',
    ],
    img: [
      ...defaultAttributes('img'),
      'className',
      'loading',
      'decoding',
      'referrerPolicy',
    ],
    span: [
      ...defaultAttributes('span'),
      'className',
    ],
    details: ['open', 'className'],
    summary: ['className'],
    pre: [
      ...defaultAttributes('pre'),
      'className',
    ],
  },
  clobberPrefix: '',
};

type HeadingEntry = { id: string; title: string; level: number };

type HastLike = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastLike[];
};

const TOC_HEADING_LEVELS: Record<string, number> = { h2: 2, h3: 3 };

function textOf(node: HastLike): string {
  if (node.type === 'text') return node.value || '';
  return (node.children || []).map(textOf).join('');
}

/** rehype-slug の後に置き、本文に出るのと同じ id で目次用の見出しを集める。 */
function collectHeadings(options: { into: HeadingEntry[] }) {
  return (tree: HastLike) => {
    const visit = (node?: HastLike) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'element' && node.tagName) {
        const level = TOC_HEADING_LEVELS[node.tagName];
        const id = node.properties?.id;
        if (level && typeof id === 'string') {
          options.into.push({ id, title: textOf(node), level });
        }
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}

export type ParsedMarkdown<T> = {
  frontmatter: T;
  contentHtml: string;
  raw: string;
};

export async function parseMarkdownFile<T>(filePath: string): Promise<{
  data: T;
  contentHtml: string;
  headings: { id: string; title: string; level: number }[];
  raw: string;
}> {
  const stat = await fs.stat(filePath);
  const cacheKey = `markdown:${filePath}:${stat.mtimeMs}`;
  return cached(cacheKey, async () => {
    const raw = await fs.readFile(filePath, 'utf8');
    const { content, data } = matter(raw);
    const legacyAnchors = parseLegacyAnchors((data as Record<string, unknown>).legacyAnchors, filePath);
    // 見出しは rehype-slug が付けた id をそのまま読む。別に slug を計算すると、
    // inline code を含む見出しや重複見出しで本文の id と食い違う。
    const headings: { id: string; title: string; level: number }[] = [];

    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkLinkCard)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw) // enable raw HTML like <details><summary>
      .use(rehypeSanitize, markdownSanitizeSchema)
      .use(rehypeSlug)
      .use(collectHeadings, { into: headings })
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
      .use(rehypeLegacyAnchors, { aliases: legacyAnchors, sourcePath: filePath })
      .use(rehypeExternalLinks)
      .use(rehypeImgDefaults)
      .use(rehypeKatex, { strict: false })
      .use(rehypePrism)
      .use(rehypeStringify)
      .process(content);
    return { data: data as T, contentHtml: String(file), headings, raw };
  });
}

export function slugFromFilename(fp: string) {
  return path.basename(fp).replace(/\.mdx?$/, '');
}

export const SEARCH_TEXT_MAX_LENGTH = 4000;

// 一覧ページの全文検索用に、frontmatter・コードブロック・URL・markdown 記号を落とした
// plain text を作る。ページ payload の肥大を防ぐため既定で 4000 文字に切り詰める。
export function extractMarkdownSearchText(source: string, maxLength = SEARCH_TEXT_MAX_LENGTH): string {
  const { content } = matter(source);
  const text = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`([^`\n]*)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
    .replace(/^\s{0,3}\[[^\]]+\]:\s+\S+.*$/gm, ' ')
    .replace(/<[^>\n]+>/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, ' ')
    .replace(/[*_~|\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}
