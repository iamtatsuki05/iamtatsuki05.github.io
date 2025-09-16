import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog Posts',
  description: 'Browse blog posts by Tatsuki Okada about natural language processing, machine learning, and development.',
  locale: 'en',
  path: '/en/blogs/',
  languageAlternates: {
    'ja-JP': '/ja/blogs/',
    'en-US': '/en/blogs/',
    'x-default': '/blogs/',
  },
});

export default async function BlogEn() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📝 Blog</div>
      <h1 className="text-3xl font-bold">📝 Blog</h1>
      <BlogsClient posts={posts} locale="en" />
    </div>
  );
}
