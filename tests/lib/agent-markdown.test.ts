import { onRequest } from '../../functions/_middleware';
import { htmlToMarkdown } from '@/lib/agent/htmlToMarkdown';
import { markdownPathFor, prefersMarkdown } from '@/lib/agent/markdownNegotiation';

describe('prefersMarkdown', () => {
  it.each([
    ['text/markdown', true],
    ['text/markdown, text/html;q=0.9', true],
    ['text/html, text/markdown', true],
    ['text/html, text/markdown;q=0.5', false],
    ['text/markdown;q=0', false],
    ['text/html,application/xhtml+xml,*/*;q=0.8', false],
    [null, false],
  ])('%s -> %s', (accept, expected) => {
    expect(prefersMarkdown(accept)).toBe(expected);
  });
});

describe('markdownPathFor', () => {
  it('maps pages to their exported index.md and ignores files', () => {
    expect(markdownPathFor('/')).toBe('/index.md');
    expect(markdownPathFor('/blogs/hello/')).toBe('/blogs/hello/index.md');
    expect(markdownPathFor('/en/cv')).toBe('/en/cv/index.md');
    expect(markdownPathFor('/rss.xml')).toBeNull();
    expect(markdownPathFor('/_astro/app.js')).toBeNull();
  });
});

function run(pathname: string, accept: string | null, assets: Record<string, string>) {
  const headers = accept ? { Accept: accept } : undefined;
  return onRequest({
    request: new Request(`https://example.com${pathname}`, { headers }),
    next: async () =>
      new Response('<html></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8', Vary: 'Accept-Encoding' } }),
    env: {
      ASSETS: {
        fetch: async (input) => {
          const body = assets[new URL(String(input)).pathname];
          return body === undefined ? new Response('missing', { status: 404 }) : new Response(body);
        },
      },
    },
  });
}

describe('pages middleware', () => {
  it('serves the markdown alternate when the client asks for markdown', async () => {
    const response = await run('/blogs/hello/', 'text/markdown', { '/blogs/hello/index.md': '# Hello' });
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('Vary')).toContain('Accept');
    expect(await response.text()).toBe('# Hello');
  });

  it('keeps HTML for browsers and advertises the alternates', async () => {
    const response = await run('/', 'text/html', { '/index.md': '# Home' });
    expect(response.headers.get('Content-Type')).toBe('text/html; charset=utf-8');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding, Accept');
    expect(response.headers.get('Link')).toContain('</index.md>; rel="alternate"; type="text/markdown"');
    expect(response.headers.get('Link')).toContain('</sitemap.xml>; rel="sitemap"');
  });

  it('answers unknown pages with a markdown 404', async () => {
    const response = await run('/nope/', 'text/markdown', {});
    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
    expect(await response.text()).toContain('[Sitemap](/sitemap.xml)');
  });

  it('passes files through untouched', async () => {
    const response = await run('/rss.xml', 'text/markdown', {});
    expect(response.headers.get('Link')).toBeNull();
  });
});

describe('htmlToMarkdown', () => {
  it('converts the main content and drops page chrome', async () => {
    const html = `<!doctype html><html lang="en"><head><title>Hello | Site</title>
      <meta name="description" content="A post"></head>
      <body><header>Menu</header><main><nav>crumbs</nav><h1><a href="#hello">Hello</a></h1><p>See <a href="/x/">x</a>.</p>
      <script>alert(1)</script><button>Copy</button></main><footer>foot</footer></body></html>`;
    const markdown = await htmlToMarkdown(html, { url: 'https://example.com/hello/' });
    expect(markdown).toBe(
      '---\ntitle: "Hello | Site"\ndescription: "A post"\nurl: "https://example.com/hello/"\nlang: "en"\n---\n\n# Hello\n\nSee [x](/x/).\n',
    );
  });
});
