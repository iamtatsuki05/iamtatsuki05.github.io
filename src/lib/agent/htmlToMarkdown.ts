import type { Element, Root, RootContent } from 'hast';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

const DROPPED_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'button', 'form', 'iframe', 'nav']);

type PageMarkdownOptions = {
  url: string;
};

function isElement(node: RootContent | Root): node is Element {
  return node.type === 'element';
}

function findElement(node: Root | Element, tagName: string): Element | undefined {
  for (const child of node.children) {
    if (!isElement(child)) continue;
    if (child.tagName === tagName) return child;
    const found = findElement(child, tagName);
    if (found) return found;
  }
  return undefined;
}

function textOf(node: Element | undefined): string {
  if (!node) return '';
  return node.children
    .map((child) => (child.type === 'text' ? child.value : isElement(child) ? textOf(child) : ''))
    .join('');
}

function metaContent(head: Element | undefined, name: string): string {
  if (!head) return '';
  const meta = head.children.find(
    (child): child is Element => isElement(child) && child.tagName === 'meta' && child.properties.name === name,
  );
  return typeof meta?.properties.content === 'string' ? meta.properties.content : '';
}

function isFragmentLink(node: Element): boolean {
  return node.tagName === 'a' && typeof node.properties.href === 'string' && node.properties.href.startsWith('#');
}

function prune(node: Element): Element {
  return {
    ...node,
    children: node.children
      .filter((child) => !(isElement(child) && (DROPPED_TAGS.has(child.tagName) || child.properties.hidden !== undefined)))
      .filter((child) => child.type !== 'comment')
      // Heading self-links (rehype-autolink-headings) only add noise to Markdown.
      .flatMap((child) => (isElement(child) && isFragmentLink(child) ? child.children : [child]))
      .map((child) => (isElement(child) ? prune(child) : child)),
  };
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export async function htmlToMarkdown(html: string, { url }: PageMarkdownOptions): Promise<string> {
  const tree = unified().use(rehypeParse).parse(html);
  const htmlElement = findElement(tree, 'html');
  const head = findElement(tree, 'head');
  const main = findElement(tree, 'main') ?? findElement(tree, 'body');
  if (!main) throw new Error(`no <main> or <body> in page ${url}`);

  const lang = typeof htmlElement?.properties.lang === 'string' ? htmlElement.properties.lang : '';
  const frontmatter = [
    '---',
    `title: ${yamlString(textOf(findElement(head ?? tree, 'title')).trim())}`,
    `description: ${yamlString(metaContent(head, 'description'))}`,
    `url: ${yamlString(url)}`,
    ...(lang ? [`lang: ${yamlString(lang)}`] : []),
    '---',
  ].join('\n');

  const body = String(
    await unified()
      .use(rehypeParse)
      .use(() => (): Root => ({ type: 'root', children: [prune(main)] }))
      .use(rehypeRemark)
      .use(remarkGfm)
      .use(remarkStringify, { bullet: '-', rule: '-' })
      .process(html),
  ).trim();
  return `${frontmatter}\n\n${body}\n`;
}
