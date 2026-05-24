import type { APIRoute } from 'astro';
import { Feed } from 'feed';
import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';
import { siteConfig } from '@/lib/seo';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';
import { buildBlogRssDescription } from '@/lib/blog/rss';

export const GET: APIRoute = async () => {
  const site = getSiteUrlWithBasePath();
  const feed = new Feed({
    title: `${siteConfig.owner} Blogs`,
    description: siteConfig.description.ja,
    id: site,
    link: site,
    language: 'mul',
    image: `${site}${siteConfig.defaultOgImage}`,
    favicon: `${site}/favicon.ico`,
    copyright: `${new Date().getFullYear()} ${siteConfig.owner}`,
  });

  for (const locale of SUPPORTED_LOCALES) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      const path = locale === 'ja' ? `/blogs/${post.slug}/` : localizedPath(`/blogs/${post.slug}/`, locale);
      const url = `${site}${path}`;
      const date = new Date(post.updated || post.date);
      feed.addItem({
        id: url,
        link: url,
        title: post.title,
        description: buildBlogRssDescription(post, locale, site),
        date: Number.isNaN(date.getTime()) ? new Date() : date,
      });
    }
  }

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
