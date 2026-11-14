import { GET } from '@/pages/robots.txt';

describe('robots.txt', () => {
  it('declares content signals, AI bot rules, and the sitemap', async () => {
    const response = await GET({} as Parameters<typeof GET>[0]);
    const body = await response.text();
    expect(body).toMatch(/^User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=(yes|no)\nAllow: \//);
    expect(body).toContain('User-agent: GPTBot');
    expect(body).toContain('User-agent: Claude-SearchBot');
    expect(body).toMatch(/\nSitemap: https?:\/\/\S+\/sitemap\.xml\n$/);
  });
});
