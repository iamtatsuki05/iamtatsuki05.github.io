import type { APIRoute } from 'astro';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

// Owner's policy for AI use of the site's content (https://contentsignals.org/). Edit ai-train to opt out of training.
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

const AI_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Claude-SearchBot',
  'Claude-User',
  'ClaudeBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
];

export const GET: APIRoute = () => {
  const site = getSiteUrlWithBasePath();
  const body = [
    'User-agent: *',
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    '',
    ...AI_BOTS.map((bot) => `User-agent: ${bot}`),
    `Content-Signal: ${CONTENT_SIGNAL}`,
    'Allow: /',
    '',
    `Sitemap: ${site}/sitemap.xml`,
    '',
  ].join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
