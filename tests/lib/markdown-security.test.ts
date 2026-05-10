import { afterEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { parseMarkdownFile } from '@/lib/content/markdown';

describe('content/markdown security', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
      tmpDir = undefined;
    }
  });

  async function parseMarkdown(content: string) {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'markdown-security-'));
    const filePath = path.join(tmpDir, 'post.md');
    await writeFile(filePath, `---\ntitle: Test\n---\n\n${content}`, 'utf8');
    return parseMarkdownFile(filePath);
  }

  it('strips script tags and event handler attributes from raw HTML', async () => {
    const result = await parseMarkdown(
      '<details open onclick="alert(1)"><summary>More</summary><script>alert(1)</script><p><img src="/x.png" onerror="alert(1)" /></p></details>',
    );

    expect(result.contentHtml).toContain('<details open>');
    expect(result.contentHtml).toContain('<summary>More</summary>');
    expect(result.contentHtml).not.toContain('<script');
    expect(result.contentHtml).not.toContain('onclick');
    expect(result.contentHtml).not.toContain('onerror');
  });
});
