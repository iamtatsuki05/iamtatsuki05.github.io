import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const site =
    (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)?.trim() ||
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://iamtatsuki05.github.io');
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${site}/sitemap.xml`,
  };
}
