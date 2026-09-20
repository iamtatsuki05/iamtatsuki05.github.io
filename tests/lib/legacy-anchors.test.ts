import { afterEach, describe, expect, it } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { parseMarkdownFile } from '@/lib/content/markdown';
import { getPostBySlug } from '@/lib/content/blog';
import { BlogFrontmatter } from '@/lib/content/types';

describe('content/legacy anchors', () => {
  let tmpDir: string | undefined;

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
      tmpDir = undefined;
    }
  });

  async function parseMarkdown(frontmatter: string, content: string) {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'legacy-anchors-'));
    const filePath = path.join(tmpDir, 'post.md');
    await writeFile(filePath, `---\ntitle: Test\n${frontmatter}---\n\n${content}`, 'utf8');
    return parseMarkdownFile(filePath);
  }

  it('keeps an old anchor reachable after a heading is renamed', async () => {
    const result = await parseMarkdown(
      "legacyAnchors:\n  '数字': '移行前後の数字'\n",
      '## 移行前後の数字\n\nbuild time は 8 分の 1 になりました。',
    );

    expect(result.contentHtml).toContain('<h2 id="移行前後の数字">');
    expect(result.contentHtml).toContain('<span id="数字" class="legacy-anchor"></span>');
    // 旧アンカーは見出しの中に置くので、リンクは同じ節に着地する
    expect(result.contentHtml).toMatch(/<h2 id="移行前後の数字"><span id="数字" class="legacy-anchor"><\/span>/);
  });

  it('supports several old anchors pointing at the same heading', async () => {
    const result = await parseMarkdown(
      "legacyAnchors:\n  'numbers': 'numbers-before-and-after'\n  'figures': 'numbers-before-and-after'\n",
      '## Numbers Before and After\n',
    );

    expect(result.contentHtml).toContain('<span id="numbers" class="legacy-anchor"></span>');
    expect(result.contentHtml).toContain('<span id="figures" class="legacy-anchor"></span>');
  });

  it('adds nothing when the post has no legacyAnchors', async () => {
    const result = await parseMarkdown('', '## Numbers\n');

    expect(result.contentHtml).toContain('<h2 id="numbers">');
    expect(result.contentHtml).not.toContain('<span id=');
  });

  it('fails when an old anchor points at a heading that does not exist', async () => {
    await expect(
      parseMarkdown("legacyAnchors:\n  'numbers': 'typo-in-the-target'\n", '## Numbers Before and After\n'),
    ).rejects.toThrow(/do not exist: typo-in-the-target/);
  });

  it('fails when an old anchor would duplicate an id a heading already uses', async () => {
    await expect(
      parseMarkdown("legacyAnchors:\n  'numbers': 'numbers-before-and-after'\n", '## Numbers\n\n## Numbers Before and After\n'),
    ).rejects.toThrow(/duplicate ids already used by the page: numbers/);
  });

  it('treats an empty legacyAnchors key as no aliases, and keeps the post loadable', async () => {
    const result = await parseMarkdown('legacyAnchors:\n', '## Numbers\n');

    expect(result.contentHtml).not.toContain('<span id=');
    expect(BlogFrontmatter.safeParse({ title: 't', date: '2026-05-24', legacyAnchors: null }).success).toBe(true);
  });

  it('fails when an old anchor is not a slug', async () => {
    await expect(parseMarkdown("legacyAnchors:\n  '#numbers': 'numbers'\n", '## Numbers\n')).rejects.toThrow(
      /is not a slug/,
    );
    await expect(parseMarkdown("legacyAnchors:\n  'Numbers': 'numbers'\n", '## Numbers\n')).rejects.toThrow(
      /is not a slug/,
    );
  });

  it('fails when an old anchor maps to something other than a string', async () => {
    await expect(parseMarkdown('legacyAnchors:\n  numbers: 1\n', '## Numbers\n')).rejects.toThrow(
      /must be a non-empty string/,
    );
  });

  it('fails when legacyAnchors is not a mapping of strings', async () => {
    await expect(parseMarkdown('legacyAnchors:\n  - numbers\n', '## Numbers\n')).rejects.toThrow(
      /legacyAnchors must be a mapping/,
    );
  });

  it('renders the published old anchors for the renamed headings', async () => {
    const ja = await getPostBySlug('2026-05-24-next-to-astro-with-ai');
    const zh = await getPostBySlug('2026-05-24-next-to-astro-with-ai', 'zh');

    expect(ja?.html).toContain('<span id="数字" class="legacy-anchor"></span>');
    expect(zh?.html).toContain('<span id="开始" class="legacy-anchor"></span>');
    expect(zh?.html).toContain('<span id="结束" class="legacy-anchor"></span>');
  });
});
