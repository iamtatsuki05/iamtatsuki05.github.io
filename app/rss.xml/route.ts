import { NextResponse } from 'next/server';
import { buildRssXml } from '@/lib/server/site-files';

export const dynamic = 'force-static';

export async function GET() {
  const rss = await buildRssXml();
  return new NextResponse(rss, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
