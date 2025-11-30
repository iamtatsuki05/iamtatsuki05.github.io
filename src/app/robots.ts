import type { MetadataRoute } from 'next';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrlWithBasePath();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site}/sitemap.xml`,
  };
}
