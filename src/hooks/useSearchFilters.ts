import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';

type Options<T> = {
  fuseKeys: string[];
  threshold?: number;
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => string[];
};

export function useSearchFilters<T>(items: T[], { fuseKeys, threshold = 0.35, extractYear, extractTags }: Options<T>) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState('');
  const [tagSet, setTagSet] = useState<Set<string>>(new Set());

  const fuse = useMemo(() => new Fuse(items, { keys: fuseKeys, threshold }), [items, fuseKeys, threshold]);

  const years = useMemo(
    () =>
      Array.from(new Set(items.map((item) => (extractYear(item) || '').slice(0, 4))))
        .filter(Boolean)
        .sort((a, b) => (a < b ? 1 : -1)),
    [items, extractYear],
  );

  const allTags = useMemo(
    () => Array.from(new Set(items.flatMap((item) => extractTags(item)))).sort(),
    [items, extractTags],
  );

  const filtered = useMemo(() => {
    let result = q ? fuse.search(q).map((r) => r.item) : items;
    if (year) result = result.filter((item) => (extractYear(item) || '').startsWith(year));
    if (tagSet.size) result = result.filter((item) => extractTags(item).some((tag) => tagSet.has(tag)));
    return result;
  }, [items, fuse, q, year, tagSet, extractYear, extractTags]);

  const clearFilters = () => {
    setQ('');
    setYear('');
    setTagSet(new Set());
  };

  return {
    q,
    setQ,
    year,
    setYear,
    tagSet,
    setTagSet,
    fuse,
    years,
    allTags,
    filtered,
    clearFilters,
  };
}
