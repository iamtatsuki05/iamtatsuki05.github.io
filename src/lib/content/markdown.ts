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
import GithubSlugger from 'github-slugger';
import type { Root as MdastRoot, Text, InlineCode, RootContent } from 'mdast';
import { cached } from '@/lib/server/cache';
import remarkLinkCard from './remark-link-card';
import rehypeImgDefaults from './rehype-img';
import rehypeExternalLinks from './rehype-external-links';

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
    // 1) 抽出: 見出し（h2/h3）を抽出し、GitHub互換のスラッグを付与
    const mdast = (await unified().use(remarkParse).parse(content)) as MdastRoot;
    const slugger = new GithubSlugger();
    const headings: { id: string; title: string; level: number }[] = [];
    const visit = (node: RootContent) => {
      if (!node) return;
      if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
        const text = (node.children || [])
          .filter((c): c is Text | InlineCode => c.type === 'text' || c.type === 'inlineCode')
          .map((c) => c.value)
          .join(' ');
        const id = slugger.slug(text || '');
        headings.push({ id, title: text, level: node.depth });
      }
      if ('children' in node && Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };
    mdast.children.forEach(visit);

    // 2) HTML へ変換
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkLinkCard)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw) // enable raw HTML like <details><summary>
      .use(rehypeSanitize, markdownSanitizeSchema)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
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
