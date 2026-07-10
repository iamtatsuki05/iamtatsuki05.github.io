import type { BlogPost } from '@/lib/content/blog';

export type RelatedPostCandidate = Pick<BlogPost, 'slug' | 'title' | 'date' | 'tags' | 'summary'>;

export const RELATED_POSTS_LIMIT = 3;

export function selectRelatedPosts<T extends RelatedPostCandidate>(
  posts: T[],
  currentSlug: string,
  limit: number = RELATED_POSTS_LIMIT,
): T[] {
  if (limit <= 0) return [];
  const current = posts.find((post) => post.slug === currentSlug);
  const currentTags = new Set(current?.tags ?? []);
  if (currentTags.size === 0) return [];

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      commonTagCount: new Set((post.tags ?? []).filter((tag) => currentTags.has(tag))).size,
    }))
    .filter((entry) => entry.commonTagCount > 0)
    .sort(
      (a, b) =>
        b.commonTagCount - a.commonTagCount || toTimestamp(b.post.date) - toTimestamp(a.post.date),
    )
    .slice(0, limit)
    .map((entry) => entry.post);
}

function toTimestamp(dateLike: string) {
  const time = new Date(dateLike).getTime();
  return Number.isNaN(time) ? 0 : time;
}
