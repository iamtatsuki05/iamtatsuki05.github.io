import { describe, it, expect } from 'vitest';
import { BlogFrontmatter, PublicationFrontmatter } from '@/lib/content/types';

describe('Frontmatter schemas', () => {
  it('accepts Date objects for blog date and converts to string', () => {
    const parsed = BlogFrontmatter.parse({ title: 't', date: new Date('2024-12-10') });
    expect(typeof parsed.date).toBe('string');
    expect(parsed.title).toBe('t');
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
});

