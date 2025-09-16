import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from './sections/BlogsClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'ブログ記事一覧',
  description: '岡田 龍樹による自然言語処理や機械学習に関するブログ記事の一覧です。',
  locale: 'ja',
  path: '/blogs/',
  languageAlternates: {
    'ja-JP': '/ja/blogs/',
    'en-US': '/en/blogs/',
    'x-default': '/blogs/',
  },
});

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📝 Blog</div>
      <h1 className="text-3xl font-bold">📝 Blog</h1>
      <BlogsClient posts={posts} locale="ja" />
    </div>
  );
}
