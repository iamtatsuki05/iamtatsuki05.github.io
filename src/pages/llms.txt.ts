import type { APIRoute } from 'astro';
import { buildLlmsTxt } from '@/lib/agent/llmsTxt';
import { getSiteUrlWithBasePath } from '@/lib/config/env';
import { getAllPosts } from '@/lib/content/blog';
import { getAllPublications } from '@/lib/content/publication';
import { siteConfig } from '@/lib/seo';

export const GET: APIRoute = async () => {
  const [posts, publications] = await Promise.all([getAllPosts(), getAllPublications()]);
  const body = buildLlmsTxt({
    site: getSiteUrlWithBasePath(),
    owner: `${siteConfig.owner} (${siteConfig.aliases[0]})`,
    summary: siteConfig.description.en,
    contactEmail: siteConfig.contactEmail,
    posts: posts.map(({ slug, title, summary, date }) => ({ slug, title, summary, date })),
    publications: publications.map(({ title, type, venue, publishedAt }) => ({ title, type, venue, publishedAt })),
  });
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
