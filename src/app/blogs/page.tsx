import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from './sections/BlogsClient';
import { buildPageMetadata, buildCollectionPageJsonLd, buildBreadcrumbJsonLd, buildLanguageAlternates, absoluteUrl } from '@/lib/seo';
import { blogsPageCopy } from '@/app/(site)/_config/pageCopy';
import { getPageMeta } from '@/lib/seo/metaConfig';

const DEFAULT_LOCALE: Locale = 'ja';
const copy = blogsPageCopy[DEFAULT_LOCALE];
const pageMeta = getPageMeta('blogs', DEFAULT_LOCALE);

export const metadata: Metadata = buildPageMetadata({
  title: pageMeta.metadataTitle,
  description: pageMeta.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: pageMeta.path,
  languageAlternates: buildLanguageAlternates(pageMeta.path),
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  const collectionJsonLd = buildCollectionPageJsonLd({
    path: '/blogs/',
    name: 'Blog',
    description: '技術ブログと記事',
    itemCount: posts.length,
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd({
    items: [
      { name: 'Home', url: absoluteUrl('/') },
      { name: 'Blog', url: absoluteUrl('/blogs/') },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="space-y-4">
        <div className="text-sm opacity-70">{copy.breadcrumb}</div>
        <h1 className="text-3xl font-bold">{copy.heading}</h1>
        <Suspense fallback={null}>
          <BlogsClient posts={posts} locale={DEFAULT_LOCALE} />
        </Suspense>
      </div>
    </>
  );
}
