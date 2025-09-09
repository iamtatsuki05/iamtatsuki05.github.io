import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';

export default async function BlogJa() {
  const posts = await getAllPosts();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📝 ブログ</div>
      <h1 className="text-3xl font-bold">📝 ブログ</h1>
      <BlogsClient posts={posts} locale="ja" />
    </div>
  );
}
