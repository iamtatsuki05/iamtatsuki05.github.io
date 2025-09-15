import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { BASE_PATH } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  const site =
    (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://iamtatsuki05.github.io');
  const trimmed = site.replace(/\/$/, '');
  const need = BASE_PATH || '';
  const originWithBase = need && !trimmed.endsWith(need) ? `${trimmed}${need}` : trimmed;
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${originWithBase}/sitemap.xml`,
  };
}
