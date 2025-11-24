import { NextResponse } from 'next/server';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

export const dynamic = 'force-static';

export function GET() {
  const site = getSiteUrlWithBasePath();
  const body = `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`;
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
