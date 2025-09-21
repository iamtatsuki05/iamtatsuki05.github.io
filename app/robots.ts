import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export default function robots(): MetadataRoute.Robots {
  const originWithBase = getSiteUrlWithBasePath();
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${originWithBase}/sitemap.xml`,
  };
}
