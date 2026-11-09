import { describe, it, expect } from 'vitest';
import { BlogFrontmatter, PublicationFrontmatter, parseFrontmatter } from '@/lib/content/types';

describe('Frontmatter schemas', () => {
  it('accepts Date objects for blog date and converts to string', () => {
    const parsed = BlogFrontmatter.parse({ title: 't', date: new Date('2024-12-10') });
    expect(typeof parsed.date).toBe('string');
    expect(parsed.title).toBe('t');
    expect(parsed.aiAssisted).toBe(false);
  });
  it('accepts AI-assisted blog frontmatter', () => {
    const parsed = BlogFrontmatter.parse({ title: 't', date: '2024-12-10', aiAssisted: true });
    expect(parsed.aiAssisted).toBe(true);
  });
  it('accepts publication schema with links', () => {
    const parsed = PublicationFrontmatter.parse({
      title: 'p',
      type: 'paper',
      publishedAt: new Date('2024-01-01'),
      links: [{ kind: 'doi', url: 'https://doi.org/x' }],
    });
    expect(parsed.type).toBe('paper');
    expect(typeof parsed.publishedAt).toBe('string');
  });
  it('accepts a paper landing-page link', () => {
    const parsed = PublicationFrontmatter.parse({
      title: 'p',
      type: 'paper',
      links: [{ kind: 'paper', url: 'https://aclanthology.org/2026.aacl-demo.9/' }],
    });
    expect(parsed.links[0].kind).toBe('paper');
  });
  it('rejects the retired pdf link kind', () => {
    const result = PublicationFrontmatter.safeParse({
      title: 'p',
      type: 'paper',
      links: [{ kind: 'pdf', url: 'https://example.com/paper.pdf' }],
    });
    expect(result.success).toBe(false);
  });
  it('rejects a blog date that is not a date', () => {
    const result = BlogFrontmatter.safeParse({ title: 't', date: 'someday' });
    expect(result.success).toBe(false);
  });
  it('throws with the file path when frontmatter is invalid', () => {
    expect(() => parseFrontmatter(BlogFrontmatter, { title: 't', date: '2024-12-10', tags: 'foo' }, '/content/blogs/x.md')).toThrow(
      /Invalid frontmatter in \/content\/blogs\/x\.md/,
    );
  });
});
