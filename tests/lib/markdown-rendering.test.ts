import { afterEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { parseMarkdownFile } from '@/lib/content/markdown';

describe('content/markdown rendering', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
      tmpDir = undefined;
    }
  });

  async function parseMarkdown(content: string) {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'markdown-rendering-'));
    const filePath = path.join(tmpDir, 'post.md');
    await writeFile(filePath, `---\ntitle: Test\n---\n\n${content}`, 'utf8');
    return parseMarkdownFile(filePath);
  }

  it('renders fenced code blocks with syntax-highlight token spans', async () => {
    const result = await parseMarkdown('```ts\nconst answer = 42;\n```');

    expect(result.contentHtml).toContain('class="language-ts"');
    expect(result.contentHtml).toContain('class="token keyword"');
    expect(result.contentHtml).toContain('class="token number"');
  });

  it('reports heading ids that match the ones rendered in the html', async () => {
    const result = await parseMarkdown('## `.agent` に AI 用の前提を集める\n\ntext\n');

    expect(result.headings).toEqual([
      { id: 'agent-に-ai-用の前提を集める', title: '.agent に AI 用の前提を集める', level: 2 },
    ]);
    expect(result.contentHtml).toContain('<h2 id="agent-に-ai-用の前提を集める">');
  });

  it('keeps the dedupe suffix in step with the rendered html', async () => {
    const result = await parseMarkdown('# Notes\n\n## Notes\n\n## Notes\n');

    expect(result.headings.map((heading) => heading.id)).toEqual(['notes-1', 'notes-2']);
    expect(result.contentHtml).toContain('<h1 id="notes">');
    expect(result.contentHtml).toContain('<h2 id="notes-1">');
    expect(result.contentHtml).toContain('<h2 id="notes-2">');
  });

  it('keeps heading text that is not a plain text node', async () => {
    const result = await parseMarkdown('## Read the [docs](https://example.com) **now**\n');

    expect(result.headings[0]).toEqual({ id: 'read-the-docs-now', title: 'Read the docs now', level: 2 });
    expect(result.contentHtml).toContain('<h2 id="read-the-docs-now">');
  });

  it('includes headings that come from raw html in the body', async () => {
    const result = await parseMarkdown('## Intro\n\n<details>\n<summary>More</summary>\n\n### Buried\n\n</details>\n');

    expect(result.headings.map((heading) => heading.id)).toEqual(['intro', 'buried']);
    expect(result.contentHtml).toContain('<h3 id="buried">');
  });

  it('skips a heading that has no id to link to', async () => {
    const result = await parseMarkdown('##\n\n## Intro\n');

    expect(result.headings.map((heading) => heading.id)).toEqual(['intro']);
  });

  it('renders inline and block LaTeX math', async () => {
    const result = await parseMarkdown('Inline $E = mc^2$.\n\n$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$');

    expect(result.contentHtml).toContain('class="katex"');
    expect(result.contentHtml).toContain('class="katex-display"');
    expect(result.contentHtml).toContain('E = mc');
  });
});
