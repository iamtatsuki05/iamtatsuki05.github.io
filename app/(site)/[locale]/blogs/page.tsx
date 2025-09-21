import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';
import { buildPageMetadata, defaultLanguageAlternates } from '@/lib/seo';
import type { Locale } from '@/lib/i18n';
import {
  SUPPORTED_LOCALES,
  blogsPageCopy,
  resolveLocale,
} from '@/app/(site)/_config/pageCopy';

type Params = {
  locale: string;
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = blogsPageCopy[locale];
  return buildPageMetadata({
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    locale,
    path: copy.path,
    languageAlternates: defaultLanguageAlternates,
  });
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
