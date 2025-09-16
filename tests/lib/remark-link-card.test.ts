import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import remarkLinkCard from '@/lib/content/remark-link-card';

describe('remark-link-card', () => {
  let tmpDir: string;
  let cacheFile: string;

  const createProcessor = (options?: Record<string, unknown>) =>
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkLinkCard, {
        cacheFile,
        ttlMs: 24 * 60 * 60 * 1000,
        ...options,
      });

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'remark-link-card-'));
    cacheFile = path.join(tmpDir, 'cache.json');
    await writeFile(cacheFile, '{}', 'utf8');
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('converts a YouTube link paragraph into an embed node', async () => {
    const processor = createProcessor();
    const tree = processor.parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const transformed = (await processor.run(tree)) as any;
    const node = transformed.children[0];
    expect(node.type).toBe('html');
    expect(node.value).toContain('rse-embed');
    expect(node.value).toContain('data-provider="youtube"');
    expect(node.value).toContain('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  });

  it('renders an OG card when cached metadata exists', async () => {
    const targetUrl = 'https://example.com/articles/42';
    const now = Date.now();
    await writeFile(
      cacheFile,
      JSON.stringify(
        {
          [targetUrl]: {
            url: targetUrl,
            title: 'Example Article',
            description: 'An example description',
            siteName: 'Example Site',
            fetchedAt: now,
          },
        },
        null,
        2,
      ),
      'utf8',
    );

    const processor = createProcessor();
    const tree = processor.parse(targetUrl);
    const transformed = (await processor.run(tree)) as any;
    const node = transformed.children[0];
    expect(node.type).toBe('html');
    expect(node.value).toContain('og-card');
    expect(node.value).toContain('Example Article');
    expect(node.value).toContain('Example Site');
  });

  it('keeps paragraphs unmodified when domain is not allowed', async () => {
    const processor = createProcessor({ allowDomains: ['allowed.example'] });
    const url = 'https://denied.example/path';
    const tree = processor.parse(url);
    const transformed = (await processor.run(tree)) as any;
    const node = transformed.children[0];
    expect(node.type).toBe('paragraph');
    expect(node.children[0].type).toBe('link');
    expect(node.children[0].url).toBe(url);
  });
});
