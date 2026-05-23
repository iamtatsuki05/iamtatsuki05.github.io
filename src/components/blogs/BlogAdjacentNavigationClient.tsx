"use client";

import { useMemo } from 'react';
import { useSearchParams } from '@/lib/compat/navigation';
import type { BlogPost } from '@/lib/content/blog';
import { parseBlogFilterParams } from '@/lib/blog/navigation';
import { resolveBlogPostNavigation } from '@/lib/blog/postNavigation';
import { BlogAdjacentNavigation } from '@/components/blogs/BlogAdjacentNavigation';
import type { Locale } from '@/lib/i18n';

type NavigablePost = Pick<BlogPost, 'slug' | 'title' | 'date' | 'tags' | 'summary'>;

export function BlogAdjacentNavigationClient({
  posts,
  currentSlug,
  locale,
}: {
  posts: NavigablePost[];
  currentSlug: string;
  locale?: Locale;
}) {
  const searchParams = useSearchParams();
  const navigation = useMemo(() => {
    const filters = parseBlogFilterParams(new URLSearchParams(searchParams.toString()));
    return resolveBlogPostNavigation(posts, currentSlug, filters, locale);
  }, [currentSlug, locale, posts, searchParams]);

  return (
    <BlogAdjacentNavigation
      previous={
        navigation.previous && navigation.previousHref
          ? { title: navigation.previous.title, href: navigation.previousHref }
          : null
      }
      next={navigation.next && navigation.nextHref ? { title: navigation.next.title, href: navigation.nextHref } : null}
      locale={locale}
    />
  );
}
