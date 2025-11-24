#!/usr/bin/env bun
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { Feed } from 'feed';
import { getAllPosts } from '../src/lib/content/blog';
import { getSiteUrlWithBasePath } from '../src/lib/config/env';
import { siteConfig } from '../src/lib/seo';

async function main() {
  const site = getSiteUrlWithBasePath();
  const posts = await getAllPosts();
  const feed = new Feed({
    title: 'Personal Site Blog',
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

  const outDir = path.join(process.cwd(), 'out');
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, 'rss.xml'), feed.rss2(), 'utf8');
  console.log('rss.xml generated');
}

main().catch((error) => {
  console.error('[generate-rss] failed', error);
  process.exitCode = 1;
});
