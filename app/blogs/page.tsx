import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from './sections/BlogsClient';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import { blogsPageCopy } from '@/app/(site)/_config/pageCopy';

const DEFAULT_LOCALE: Locale = 'ja';
const copy = blogsPageCopy[DEFAULT_LOCALE];

export const metadata: Metadata = buildPageMetadata({
  title: copy.metadataTitle,
  description: copy.metadataDescription,
  locale: DEFAULT_LOCALE,
  path: '/blogs/',
  languageAlternates: defaultLanguageAlternates,
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      <BlogsClient posts={posts} locale={DEFAULT_LOCALE} />
    </div>
  );
}
