#!/usr/bin/env bun
import path from 'node:path';
import { writeFile, mkdir } from 'node:fs/promises';
import { Feed } from 'feed';
import { getAllPosts } from '../src/lib/content/blog';
import { getSiteUrlWithBasePath } from '../src/lib/config/env';
import { siteConfig } from '../src/lib/seo';
import { SUPPORTED_LOCALES } from '../src/lib/i18n';
import { localizedPath } from '../src/lib/routing';
import { buildBlogRssDescription } from '../src/lib/blog/rss';

async function main() {
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
        // id を渡すと feed v6 は guid を isPermaLink="false" にするため、
        // link への fallback に任せて guid を permalink のまま保つ
        link: url,
        title: post.title,
        description: buildBlogRssDescription(post, locale, site),
        date: Number.isNaN(date.getTime()) ? new Date() : date,
      });
    }
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
