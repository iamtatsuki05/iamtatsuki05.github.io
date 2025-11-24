import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';
import { buildLocalizedMetadata, localizedStaticParams } from '@/lib/metadata';
import type { Locale } from '@/lib/i18n';
import {
  blogsPageCopy,
  resolveLocale,
} from '@/app/(site)/_config/pageCopy';

type Params = {
  locale: string;
};

export const generateStaticParams = localizedStaticParams;

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return buildLocalizedMetadata(params, blogsPageCopy);
}

export default async function LocaleBlogsPage({ params }: { params: Promise<Params> }) {
  const locale = resolveLocale((await params).locale);
  const copy = blogsPageCopy[locale];
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      <BlogsClient posts={posts} locale={locale} />
    </div>
  );
}
