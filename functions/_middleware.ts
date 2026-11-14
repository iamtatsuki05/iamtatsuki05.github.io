import {
  MARKDOWN_CONTENT_TYPE,
  markdownPathFor,
  notFoundMarkdown,
  pageLinkHeader,
  prefersMarkdown,
} from '../src/lib/agent/markdownNegotiation';

type PagesContext = {
  request: Request;
  next: () => Promise<Response>;
  env: { ASSETS: { fetch: (input: Request | string) => Promise<Response> } };
};

function withHeaders(response: Response, headers: Record<string, string>): Response {
  const result = new Response(response.body, response);
  for (const [name, value] of Object.entries(headers)) result.headers.set(name, value);
  result.headers.append('Vary', 'Accept');
  return result;
}

export async function onRequest({ request, next, env }: PagesContext): Promise<Response> {
  const url = new URL(request.url);
  const markdownPath = markdownPathFor(url.pathname);
  if (!markdownPath || (request.method !== 'GET' && request.method !== 'HEAD')) return next();

  const linkHeaders = { Link: pageLinkHeader(markdownPath) };
  if (!prefersMarkdown(request.headers.get('Accept'))) return withHeaders(await next(), linkHeaders);

  const markdown = await env.ASSETS.fetch(new URL(markdownPath, url).toString());
  if (markdown.ok) return withHeaders(markdown, { ...linkHeaders, 'Content-Type': MARKDOWN_CONTENT_TYPE });

  return withHeaders(new Response(notFoundMarkdown(url.pathname), { status: 404 }), {
    'Content-Type': MARKDOWN_CONTENT_TYPE,
  });
}
