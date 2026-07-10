import { describe, it, expect } from 'vitest';
import { extractMarkdownSearchText, SEARCH_TEXT_MAX_LENGTH } from '@/lib/content/markdown';

describe('content/markdown extractMarkdownSearchText', () => {
  it('strips frontmatter and keeps body text', () => {
    const source = [
      '---',
      'title: 記事タイトル',
      'tags: [astro]',
      '---',
      '',
      '本文の段落です。全文検索の対象になります。',
    ].join('\n');

    const text = extractMarkdownSearchText(source);
    expect(text).toContain('本文の段落です。全文検索の対象になります。');
    expect(text).not.toContain('title:');
    expect(text).not.toContain('tags:');
  });

  it('removes fenced code blocks but keeps inline code text', () => {
    const source = [
      '前置きの文章。',
      '',
      '```ts',
      'const secretInsideCode = 1;',
      '```',
      '',
      '`bun install` を実行します。',
    ].join('\n');

    const text = extractMarkdownSearchText(source);
    expect(text).not.toContain('secretInsideCode');
    expect(text).toContain('bun install');
    expect(text).not.toContain('```');
  });

  it('removes URLs but keeps link and image labels', () => {
    const source = [
      '[公式ドキュメント](https://docs.astro.build/ja/) を参照。',
      '![代替テキスト](https://example.com/image.png)',
      '直書き URL https://example.com/page も落とす。',
    ].join('\n');

    const text = extractMarkdownSearchText(source);
    expect(text).toContain('公式ドキュメント');
    expect(text).toContain('代替テキスト');
    expect(text).not.toContain('https://');
    expect(text).not.toContain('example.com');
  });

  it('removes markdown markers and html tags', () => {
    const source = [
      '## 見出しテキスト',
      '',
      '- 箇条書き項目',
      '1. 番号付き項目',
      '',
      '> 引用の文章',
      '',
      '**強調** と *斜体* と ~~打ち消し~~ を含む。',
      '',
      '<details><summary>折りたたみ</summary>詳細内容</details>',
      '',
      '---',
    ].join('\n');

    const text = extractMarkdownSearchText(source);
    expect(text).toContain('見出しテキスト');
    expect(text).toContain('箇条書き項目');
    expect(text).toContain('番号付き項目');
    expect(text).toContain('引用の文章');
    expect(text).toContain('強調 と 斜体 と 打ち消し を含む。');
    expect(text).toContain('詳細内容');
    for (const marker of ['##', '**', '~~', '<details>', '</summary>', '- ']) {
      expect(text).not.toContain(marker);
    }
  });

  it('collapses whitespace into single spaces', () => {
    const text = extractMarkdownSearchText('一行目\n\n\n二行目   と余白');
    expect(text).toBe('一行目 二行目 と余白');
  });

  it('truncates to the max length', () => {
    const long = 'あいうえお'.repeat(2000);
    expect(extractMarkdownSearchText(long).length).toBe(SEARCH_TEXT_MAX_LENGTH);
    expect(extractMarkdownSearchText(long, 100).length).toBe(100);
  });
});
