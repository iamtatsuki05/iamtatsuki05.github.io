import { useMemo, useState, useEffect, useRef } from 'react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import type Fuse from 'fuse.js';
import { buildSearchFilterMetadata } from '@/lib/search/filterMetadata';

type Options<T> = {
  fuseKeys: string[];
  threshold?: number;
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => string[];
};

type SetUpdater<T> = T | ((prev: T) => T);

function readSearchField(item: unknown, key: string): string[] {
  if (!item || typeof item !== 'object') return [];

  const value = (item as Record<string, unknown>)[key];
  if (typeof value === 'string') return [value];
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)];
  if (Array.isArray(value)) return value.flatMap((entry) => readSearchField({ value: entry }, 'value'));
  if (value && typeof value === 'object') return Object.values(value).flatMap((entry) => readSearchField({ value: entry }, 'value'));

  return [];
}

export function useSearchFilters<T>(items: T[], { fuseKeys, threshold = 0.35, extractYear, extractTags }: Options<T>) {
  const [{ q, year: selectedYears, tags }, setFilters] = useQueryStates({
    q: parseAsString.withDefault(''),
    year: parseAsArrayOf(parseAsString).withDefault([]),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
  });
  const [fuse, setFuse] = useState<Fuse<T> | null>(null);
  const [fuseLoading, setFuseLoading] = useState(false);
  const [localQ, setLocalQ] = useState(q);
  const [localYears, setLocalYears] = useState(selectedYears || []);
  const [localTags, setLocalTags] = useState(tags || []);
  const localYearsRef = useRef(localYears);
  const localTagsRef = useRef(localTags);
  const pendingQRef = useRef<string | null>(null);
  const pendingYearsRef = useRef<string | null>(null);
  const pendingTagsRef = useRef<string | null>(null);
  const yearSet = useMemo(() => new Set(localYears), [localYears]);
  const tagSet = useMemo(() => new Set(localTags), [localTags]);

  const serializeValues = (values: string[]) => values.slice().sort().join('\u0001');

  useEffect(() => {
    localYearsRef.current = localYears;
  }, [localYears]);

  useEffect(() => {
    localTagsRef.current = localTags;
  }, [localTags]);

  useEffect(() => {
    if (pendingQRef.current && q !== pendingQRef.current) return;
    pendingQRef.current = null;
    setLocalQ(q);
  }, [q]);

  useEffect(() => {
    const nextYears = selectedYears || [];
    const serialized = serializeValues(nextYears);
    if (pendingYearsRef.current && serialized !== pendingYearsRef.current) return;
    pendingYearsRef.current = null;
    setLocalYears(nextYears);
  }, [selectedYears]);

  useEffect(() => {
    const nextTags = tags || [];
    const serialized = serializeValues(nextTags);
    if (pendingTagsRef.current && serialized !== pendingTagsRef.current) return;
    pendingTagsRef.current = null;
    setLocalTags(nextTags);
  }, [tags]);

  // Fuse.js を検索が実行されたときのみ動的にロード
  useEffect(() => {
    if (localQ && !fuse && !fuseLoading) {
      setFuseLoading(true);
      import('fuse.js').then(({ default: FuseClass }) => {
        setFuse(new FuseClass(items, { keys: fuseKeys, threshold }));
        setFuseLoading(false);
      });
    }
  }, [localQ, fuse, fuseLoading, items, fuseKeys, threshold]);

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
    if (localQ) {
      if (fuse) {
        result = fuse.search(localQ).map((r) => r.item);
      } else {
        const normalizedTokens = localQ
          .trim()
          .toLocaleLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        if (normalizedTokens.length) {
          result = result.filter((item) => {
            const haystack = fuseKeys
              .flatMap((key) => readSearchField(item, key))
              .join(' ')
              .toLocaleLowerCase();

            return normalizedTokens.every((token) => haystack.includes(token));
          });
        }
      }
    }
    if (yearSet.size) {
      result = result.filter((item) => {
        const itemYear = (extractYear(item) || '').slice(0, 4);
        return yearSet.has(itemYear);
      });
    }
    if (tagSet.size) result = result.filter((item) => extractTags(item).some((tag) => tagSet.has(tag)));
    return result;
  }, [items, fuse, localQ, yearSet, tagSet, extractYear, extractTags]);

  const clearFilters = () => {
    setFilters({ q: null, year: null, tags: null });
  };

  return {
    q: localQ,
    setQ: (value: string) => {
      const nextValue = value || '';
      pendingQRef.current = nextValue;
      setLocalQ(nextValue);
      void setFilters({ q: nextValue || null });
    },
    yearSet,
    setYearSet: (next: SetUpdater<Set<string>>) => {
      const resolved = typeof next === 'function' ? next(new Set(localYearsRef.current)) : next;
      const normalized = Array.from(new Set(resolved)).sort((a, b) => (a < b ? 1 : -1));

      pendingYearsRef.current = serializeValues(normalized);
      setLocalYears(normalized);
      void setFilters({ year: normalized.length ? normalized : null });
    },
    tagSet,
    setTagSet: (next: SetUpdater<Set<string>>) => {
      const resolved = typeof next === 'function' ? next(new Set(localTagsRef.current)) : next;
      const normalized = Array.from(new Set(resolved)).sort();

      pendingTagsRef.current = serializeValues(normalized);
      setLocalTags(normalized);
      void setFilters({ tags: normalized.length ? normalized : null });
    },
    fuseLoading: Boolean(localQ) && fuseLoading && !fuse,
    fuse,
    years,
    allTags,
    filtered,
    clearFilters,
  };
}
