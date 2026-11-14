// Imported by functions/_middleware.ts, which Wrangler bundles without the '@/' alias: keep imports relative.

export const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

function qualityOf(accept: string, mediaType: string): number {
  let best = 0;
  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().toLowerCase().split(';');
    if (type?.trim() !== mediaType) continue;
    const q = params.map((param) => param.trim()).find((param) => param.startsWith('q='));
    const value = q ? Number.parseFloat(q.slice(2)) : 1;
    if (Number.isFinite(value)) best = Math.max(best, value);
  }
  return best;
}

export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  const markdown = qualityOf(accept, 'text/markdown');
  return markdown > 0 && markdown >= qualityOf(accept, 'text/html');
}

/** Pages are exported as `<path>/index.html`; any path whose last segment has an extension is a file, not a page. */
export function markdownPathFor(pathname: string): string | null {
  const lastSegment = pathname.split('/').pop() ?? '';
  if (lastSegment.includes('.')) return null;
  return `${pathname.replace(/\/+$/, '')}/index.md`;
}

export function pageLinkHeader(markdownPath: string): string {
  return [
    `<${markdownPath}>; rel="alternate"; type="text/markdown"`,
    '</sitemap.xml>; rel="sitemap"; type="application/xml"',
    '</rss.xml>; rel="alternate"; type="application/rss+xml"',
  ].join(', ');
}

export function notFoundMarkdown(pathname: string): string {
  return [
    '# 404 Not Found',
    '',
    `No page exists at \`${pathname}\`. It may have moved or been removed.`,
    '',
    '- [Home](/)',
    '- [Blog](/blogs/)',
    '- [Publications](/publications/)',
    '- [Sitemap](/sitemap.xml)',
    '',
  ].join('\n');
}
