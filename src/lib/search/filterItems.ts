import { normalizeSearchText, tokenizeSearchQuery } from '@/lib/search/queryTokens';

export type SearchSortMode = 'relevant' | 'newest';

// Fuse.js の keys と互換の最小表現。weight 付き指定を許容する。
export type SearchKey = string | { name: string; weight?: number };

export function resolveSearchKeyName(key: SearchKey) {
  return typeof key === 'string' ? key : key.name;
}

export type SearchMatch<T> = {
  item: T;
  score?: number;
};

export type SearchFilterOptions<T> = {
  items: T[];
  query?: string;
  sort?: SearchSortMode;
  yearSet?: Set<string>;
  tagSet?: Set<string>;
  fuseKeys: SearchKey[];
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => string[];
  extractSortValue?: (item: T) => string | number | undefined;
  matches?: SearchMatch<T>[];
};

export function readSearchField(item: unknown, key: string): string[] {
  if (!item || typeof item !== 'object') return [];

  const value = (item as Record<string, unknown>)[key];
  if (typeof value === 'string') return [value];
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)];
  if (Array.isArray(value)) return value.flatMap((entry) => readSearchField({ value: entry }, 'value'));
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap((entry) => readSearchField({ value: entry }, 'value'));
  }

  return [];
}

export function resolveFusePath(path: string | string[]) {
  return Array.isArray(path) ? path.join('.') : path;
}

export function compareSearchSortValues<T>(
  left: T,
  right: T,
  extractSortValue?: (item: T) => string | number | undefined,
) {
  if (!extractSortValue) return 0;

  const leftValue = extractSortValue(left);
  const rightValue = extractSortValue(right);

  if (leftValue == null && rightValue == null) return 0;
  if (leftValue == null) return 1;
  if (rightValue == null) return -1;

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return rightValue - leftValue;
  }

  const leftText = String(leftValue);
  const rightText = String(rightValue);
  if (leftText === rightText) return 0;
  return leftText < rightText ? 1 : -1;
}

export function filterSearchItems<T>({
  items,
  query,
  sort = 'relevant',
  yearSet = new Set(),
  tagSet = new Set(),
  fuseKeys,
  extractYear,
  extractTags,
  extractSortValue,
  matches,
}: SearchFilterOptions<T>) {
  let result = items;
  const normalizedQuery = normalizeSearchText(query || '');

  if (normalizedQuery) {
    if (matches) {
      result =
        sort === 'newest'
          ? matches.map((entry) => entry.item).sort((left, right) => compareSearchSortValues(left, right, extractSortValue))
          : [...matches]
              .sort((left, right) => {
                const scoreDiff = (left.score ?? 1) - (right.score ?? 1);
                if (scoreDiff !== 0) return scoreDiff;
                return compareSearchSortValues(left.item, right.item, extractSortValue);
              })
              .map((entry) => entry.item);
    } else {
      const normalizedTokens = tokenizeSearchQuery(normalizedQuery);

      if (normalizedTokens.length) {
        result = filterByTokens({
          items,
          normalizedTokens,
          fuseKeys,
        }).sort((left, right) => compareSearchSortValues(left, right, extractSortValue));
      }
    }
  } else if (sort === 'newest' && extractSortValue) {
    result = [...result].sort((left, right) => compareSearchSortValues(left, right, extractSortValue));
  }

  return applyStructuredFilters(result, {
    yearSet,
    tagSet,
    extractYear,
    extractTags,
  });
}

function filterByTokens<T>({
  items,
  normalizedTokens,
  fuseKeys,
}: {
  items: T[];
  normalizedTokens: string[];
  fuseKeys: SearchKey[];
}) {
  return items.filter((item) => {
    const haystack = fuseKeys.flatMap((key) => readSearchField(item, resolveSearchKeyName(key))).join(' ');
    const normalizedHaystack = normalizeSearchText(haystack);

    return normalizedTokens.every((token) => normalizedHaystack.includes(token));
  });
}

function applyStructuredFilters<T>(
  items: T[],
  {
    yearSet,
    tagSet,
    extractYear,
    extractTags,
  }: {
    yearSet: Set<string>;
    tagSet: Set<string>;
    extractYear: (item: T) => string | undefined;
    extractTags: (item: T) => string[];
  },
) {
  let result = items;
  if (yearSet.size) {
    result = result.filter((item) => {
      const itemYear = (extractYear(item) || '').slice(0, 4);
      return yearSet.has(itemYear);
    });
  }
  if (tagSet.size) result = result.filter((item) => extractTags(item).some((tag) => tagSet.has(tag)));
  return result;
}
