import type { SearchSortMode } from '@/lib/search/filterItems';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';

export type BlogFilterParams = {
  q?: string;
  year?: string[];
  tags?: string[];
  sort?: SearchSortMode;
};

export function buildBlogFilterSearchParams(filters: BlogFilterParams) {
  const params = new URLSearchParams();
  const query = filters.q?.trim();
  const years = normalizeValues(filters.year);
  const tags = normalizeValues(filters.tags);

  if (query) params.set('q', query);
  if (years.length) params.set('year', years.join(','));
  if (tags.length) params.set('tags', tags.join(','));
  if (query && filters.sort === 'newest') params.set('sort', filters.sort);

  return params;
}

export function buildBlogPostHref(slug: string, filters: BlogFilterParams, locale?: Locale) {
  const params = buildBlogFilterSearchParams(filters);
  const query = params.toString();
  const path = locale ? localizedPath(`/blogs/${slug}/`, locale) : `/blogs/${slug}/`;
  return `${path}${query ? `?${query}` : ''}`;
}

export function parseBlogFilterParams(
  params:
    | URLSearchParams
    | Record<string, string | string[] | undefined>,
): BlogFilterParams {
  const read = (key: keyof BlogFilterParams) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sort = read('sort');

  return {
    q: read('q')?.trim() || undefined,
    year: parseList(read('year')),
    tags: parseList(read('tags')),
    sort: sort === 'newest' ? 'newest' : 'relevant',
  };
}

function normalizeValues(values?: string[]) {
  return Array.from(new Set(values?.map((value) => value.trim()).filter(Boolean) ?? [])).sort();
}

function parseList(value?: string) {
  return value?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? [];
}
