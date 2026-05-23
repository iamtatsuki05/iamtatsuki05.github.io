import type { APIRoute } from 'astro';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export const GET: APIRoute = () => {
  const site = getSiteUrlWithBasePath();
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
