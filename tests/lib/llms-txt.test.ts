import { describe, expect, it } from 'vitest';
import { buildLlmsTxt } from '@/lib/agent/llmsTxt';

const input = {
  site: 'https://example.com',
  owner: 'Jane Doe',
  summary: 'Portfolio\n site.',
  contactEmail: 'jane@example.com',
  posts: [{ slug: 'hello', title: 'Hello', summary: 'First post.', date: '2026-05-24T00:00:00.000Z' }],
  publications: [{ title: 'A Paper', type: 'paper', venue: 'EACL', publishedAt: '2027-03-01' }, { title: 'An App', type: 'app' }],
};

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt(input);

  it('follows the llms.txt layout: H1, blockquote summary, then H2 sections', () => {
    const lines = text.split('\n');
    expect(lines[0]).toBe('# Jane Doe');
    expect(lines[2]).toBe('> Portfolio site.');
    expect(text).toMatch(/^## When to use this site$/m);
    expect(text).toMatch(/^## Optional$/m);
  });

  it('links pages and posts to their Markdown versions', () => {
    expect(text).toContain('- [CV](https://example.com/cv/index.md): ');
    expect(text).toContain('- [Hello](https://example.com/blogs/hello/index.md): 2026-05-24. First post.');
  });

  it('lists publications with only the details they have', () => {
    expect(text).toContain('- A Paper (paper, EACL, 2027-03)');
    expect(text).toContain('- An App (app)');
  });
});
