"use client";

import { useMemo } from 'react';
import { useSearchParams } from '@/lib/compat/navigation';
import type { BlogPost } from '@/lib/content/blog';
import { parseBlogFilterParams } from '@/lib/blog/navigation';
import { resolveBlogPostNavigation } from '@/lib/blog/postNavigation';
import { BlogAdjacentNavigation } from '@/components/blogs/BlogAdjacentNavigation';

type NavigablePost = Pick<BlogPost, 'slug' | 'title' | 'date' | 'tags' | 'summary'>;

export function BlogAdjacentNavigationClient({
  posts,
  currentSlug,
}: {
  posts: NavigablePost[];
  currentSlug: string;
}) {
  const searchParams = useSearchParams();
  const navigation = useMemo(() => {
    const filters = parseBlogFilterParams(new URLSearchParams(searchParams.toString()));
    return resolveBlogPostNavigation(posts, currentSlug, filters);
  }, [currentSlug, posts, searchParams]);

  return (
    <BlogAdjacentNavigation
      previous={
        navigation.previous && navigation.previousHref
          ? { title: navigation.previous.title, href: navigation.previousHref }
          : null
      }
      next={navigation.next && navigation.nextHref ? { title: navigation.next.title, href: navigation.nextHref } : null}
    />
  );
}
