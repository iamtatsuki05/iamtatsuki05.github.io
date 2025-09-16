import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import GithubSlugger from 'github-slugger';
import type { Root as MdastRoot } from 'mdast';
import remarkLinkCard from './remark-link-card';
import rehypeImgDefaults from './rehype-img';
import rehypeExternalLinks from './rehype-external-links';

export type ParsedMarkdown<T> = {
  frontmatter: T;
  contentHtml: string;
};

export async function parseMarkdownFile<T>(filePath: string): Promise<{
  data: any;
  contentHtml: string;
  headings: { id: string; title: string; level: number }[];
}> {
  const raw = await fs.readFile(filePath, 'utf8');
  const { content, data } = matter(raw);
  // 1) 抽出: 見出し（h2/h3）を抽出し、GitHub互換のスラッグを付与
  const mdast = (await unified().use(remarkParse).parse(content)) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: { id: string; title: string; level: number }[] = [];
  const visit = (node: any) => {
    if (!node) return;
    if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
      const text = (node.children || [])
        .filter((c: any) => c.type === 'text' || c.type === 'inlineCode')
        .map((c: any) => c.value)
        .join(' ');
      const id = slugger.slug(text || '');
      headings.push({ id, title: text, level: node.depth });
    }
    (node.children || []).forEach(visit);
  };
  visit(mdast);

  // 2) HTML へ変換
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkLinkCard)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // enable raw HTML like <details><summary>
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeExternalLinks)
    .use(rehypeImgDefaults)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(content);
  return { data, contentHtml: String(file), headings };
}

export function slugFromFilename(fp: string) {
  return path.basename(fp).replace(/\.mdx?$/, '');
}
