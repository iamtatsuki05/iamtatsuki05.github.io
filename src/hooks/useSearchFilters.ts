import { useMemo, useState, useEffect } from 'react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import type Fuse from 'fuse.js';
import { buildSearchFilterMetadata } from '@/lib/search/filterMetadata';

type Options<T> = {
  fuseKeys: string[];
  threshold?: number;
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => string[];
};

export function useSearchFilters<T>(items: T[], { fuseKeys, threshold = 0.35, extractYear, extractTags }: Options<T>) {
  const [{ q, year, tags }, setFilters] = useQueryStates({
    q: parseAsString.withDefault(''),
    year: parseAsString.withDefault(''),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
  });
  const tagSet = useMemo(() => new Set(tags || []), [tags]);
  const [fuse, setFuse] = useState<Fuse<T> | null>(null);
  const [fuseLoading, setFuseLoading] = useState(false);

  // Fuse.js を検索が実行されたときのみ動的にロード
  useEffect(() => {
    if (q && !fuse && !fuseLoading) {
      setFuseLoading(true);
      import('fuse.js').then(({ default: FuseClass }) => {
        setFuse(new FuseClass(items, { keys: fuseKeys, threshold }));
        setFuseLoading(false);
      });
    }
  }, [q, fuse, fuseLoading, items, fuseKeys, threshold]);

  const metadata = useMemo(
    () =>
      buildSearchFilterMetadata(items, {
        extractYear,
        extractTags,
      }),
    [items, extractYear, extractTags],
  );

  const years = metadata.years;
  const allTags = metadata.tags;

  const filtered = useMemo(() => {
    let result = items;
    // fuse が null の場合（ロード前）は、全アイテムを返す
    if (q && fuse) {
      result = fuse.search(q).map((r) => r.item);
    }
    if (year) result = result.filter((item) => (extractYear(item) || '').startsWith(year));
    if (tagSet.size) result = result.filter((item) => extractTags(item).some((tag) => tagSet.has(tag)));
    return result;
  }, [items, fuse, q, year, tagSet, extractYear, extractTags]);

  const clearFilters = () => {
    setFilters({ q: null, year: null, tags: null });
  };

  return {
    q,
    setQ: (value: string) => {
      void setFilters({ q: value || null });
    },
    year,
    setYear: (value: string) => {
      void setFilters({ year: value || null });
    },
    tagSet,
    setTagSet: (next: Set<string>) => {
      void setFilters({ tags: Array.from(next) });
    },
    fuse,
    years,
    allTags,
    filtered,
    clearFilters,
  };
}
