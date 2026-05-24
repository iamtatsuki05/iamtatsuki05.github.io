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

  it('renders inline and block LaTeX math', async () => {
    const result = await parseMarkdown('Inline $E = mc^2$.\n\n$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$');

    expect(result.contentHtml).toContain('class="katex"');
    expect(result.contentHtml).toContain('class="katex-display"');
    expect(result.contentHtml).toContain('E = mc');
  });
});
