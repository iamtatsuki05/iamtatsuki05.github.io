import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from './sections/BlogsClient';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
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
  languageAlternates: defaultLanguageAlternates,
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      <Suspense fallback={null}>
        <BlogsClient posts={posts} locale={DEFAULT_LOCALE} />
      </Suspense>
    </div>
  );
}
