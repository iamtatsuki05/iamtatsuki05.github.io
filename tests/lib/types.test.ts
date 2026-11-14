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
      venueType: 'conference',
      region: 'international',
      refereed: true,
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
      venueType: 'conference',
      region: 'international',
      refereed: true,
      links: [{ kind: 'paper', url: 'https://aclanthology.org/2026.aacl-demo.9/' }],
    });
    expect(parsed.links[0].kind).toBe('paper');
  });
  it('accepts BibTeX that starts with an entry type and key, and rejects anything else', () => {
    const base = { title: 'p', type: 'paper', venueType: 'conference', region: 'domestic', refereed: false };
    const parsed = PublicationFrontmatter.parse({ ...base, bibtex: '@inproceedings{okada2025nlp,\n  year = "2025"\n}\n' });
    expect(parsed.bibtex).toBe('@inproceedings{okada2025nlp,\n  year = "2025"\n}');
    expect(PublicationFrontmatter.safeParse({ ...base, bibtex: 'title = "x"' }).success).toBe(false);
  });
  it('requires papers to say where they were presented and whether they were refereed', () => {
    const result = PublicationFrontmatter.safeParse({ title: 'p', type: 'paper' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(['venueType', 'region', 'refereed']);
    }
  });
  it('does not require region or refereed for non-paper entries', () => {
    const parsed = PublicationFrontmatter.parse({ title: 'a', type: 'app' });
    expect(parsed.region).toBeUndefined();
  });
  it('rejects the retired pdf link kind', () => {
    const result = PublicationFrontmatter.safeParse({
      title: 'p',
      type: 'paper',
      venueType: 'conference',
      region: 'domestic',
      refereed: false,
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
