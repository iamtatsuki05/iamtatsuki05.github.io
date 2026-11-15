import { describe, expect, it } from 'vitest';
import { fallbackPage, pathsFromSitemap, redirectPage } from '../../scripts/build-github-redirect';

describe('GitHub Pages redirect site', () => {
  it('reads page paths from the production sitemap', () => {
    const xml = '<urlset><url><loc>https://iamtatsuki05.com/</loc></url><url><loc>https://iamtatsuki05.com/blogs/a/</loc></url></urlset>';
    expect(pathsFromSitemap(xml)).toEqual(['/', '/blogs/a/']);
  });

  it('points a known page at the same path on the main domain', () => {
    const html = redirectPage('https://iamtatsuki05.com/cv/');
    expect(html).toContain('<link rel="canonical" href="https://iamtatsuki05.com/cv/">');
    expect(html).toContain('content="0; url=https://iamtatsuki05.com/cv/"');
  });

  it('keeps the path when redirecting unknown pages', () => {
    expect(fallbackPage()).toContain('location.replace("https://iamtatsuki05.com" + location.pathname');
  });
});
