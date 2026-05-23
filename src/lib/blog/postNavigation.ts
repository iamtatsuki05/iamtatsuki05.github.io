import Fuse from 'fuse.js';
import type { BlogPost } from '@/lib/content/blog';
import { buildBlogPostHref, type BlogFilterParams } from '@/lib/blog/navigation';
import type { Locale } from '@/lib/i18n';
import {
  filterSearchItems,
  readSearchField,
  resolveFusePath,
} from '@/lib/search/filterItems';
import { normalizeSearchText } from '@/lib/search/queryTokens';

type NavigableBlogPost = Pick<BlogPost, 'slug' | 'title' | 'date' | 'tags' | 'summary'>;

const BLOG_SEARCH_KEYS = ['title', 'summary', 'tags'];

export function resolveBlogPostNavigation<T extends NavigableBlogPost>(
  posts: T[],
  currentSlug: string,
  filters: BlogFilterParams,
  locale?: Locale,
) {
  const query = filters.q?.trim() || '';
  const fuse = query
    ? new Fuse(posts, {
        keys: BLOG_SEARCH_KEYS,
        threshold: 0.35,
        includeScore: true,
        getFn: (item, path) => readSearchField(item, resolveFusePath(path)).map((value) => normalizeSearchText(value)),
      })
    : null;
  const ordered = filterSearchItems({
    items: posts,
    query,
    sort: query ? filters.sort : 'newest',
    yearSet: new Set(filters.year ?? []),
    tagSet: new Set(filters.tags ?? []),
    fuseKeys: BLOG_SEARCH_KEYS,
    extractYear: (post) => post.date,
    extractTags: (post) => post.tags || [],
    extractSortValue: (post) => post.date,
    matches: fuse ? fuse.search(normalizeSearchText(query)) : undefined,
  });
  const currentIndex = ordered.findIndex((post) => post.slug === currentSlug);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : null;

  return {
    ordered,
    currentIndex,
    total: ordered.length,
    previous,
    next,
    previousHref: previous ? buildBlogPostHref(previous.slug, filters, locale) : null,
    nextHref: next ? buildBlogPostHref(next.slug, filters, locale) : null,
  };
}
