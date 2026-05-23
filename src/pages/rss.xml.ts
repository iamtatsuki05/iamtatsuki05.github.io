import type { APIRoute } from 'astro';
import { Feed } from 'feed';
import { getAllPosts } from '@/lib/content/blog';
import { getSiteUrlWithBasePath } from '@/lib/config/env';
import { siteConfig } from '@/lib/seo';

export const GET: APIRoute = async () => {
  const site = getSiteUrlWithBasePath();
  const posts = await getAllPosts();
  const feed = new Feed({
    title: 'Personal Site Blogs',
    description: siteConfig.description.ja,
    id: site,
    link: site,
    language: 'ja',
    image: `${site}${siteConfig.defaultOgImage}`,
    favicon: `${site}/favicon.ico`,
    copyright: `${new Date().getFullYear()} ${siteConfig.owner}`,
  });

  for (const post of posts) {
    const url = `${site}/blogs/${post.slug}/`;
    const date = new Date(post.updated || post.date);
    feed.addItem({
      id: url,
      link: url,
      title: post.title,
      description: post.summary,
      date: Number.isNaN(date.getTime()) ? new Date() : date,
    });
  }

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
