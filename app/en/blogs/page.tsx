import { getAllPosts } from '@/lib/content/blog';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';

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
