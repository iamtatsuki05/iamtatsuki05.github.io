import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import type Fuse from 'fuse.js';
import { buildSearchFilterMetadata } from '@/lib/search/filterMetadata';
import { normalizeSearchText } from '@/lib/search/queryTokens';
import {
  filterSearchItems,
  readSearchField,
  resolveFusePath,
  type SearchSortMode,
} from '@/lib/search/filterItems';

export type { SearchSortMode } from '@/lib/search/filterItems';

type Options<T> = {
  fuseKeys: string[];
  threshold?: number;
  extractYear: (item: T) => string | undefined;
  extractTags: (item: T) => string[];
  extractSortValue?: (item: T) => string | number | undefined;
};

type SetUpdater<T> = T | ((prev: T) => T);

export function useSearchFilters<T>(
  items: T[],
  { fuseKeys, threshold = 0.35, extractYear, extractTags, extractSortValue }: Options<T>,
) {
  const [{ q, year: selectedYears, tags, sort: selectedSort }, setFilters] = useQueryStates({
    q: parseAsString.withDefault(''),
    year: parseAsArrayOf(parseAsString).withDefault([]),
    tags: parseAsArrayOf(parseAsString).withDefault([]),
    sort: parseAsStringEnum<SearchSortMode>(['relevant', 'newest']).withDefault('relevant'),
  });
  const [fuse, setFuse] = useState<Fuse<T> | null>(null);
  const [fuseLoading, setFuseLoading] = useState(false);
  const [localQ, setLocalQ] = useState(q);
  const [localYears, setLocalYears] = useState(selectedYears || []);
  const [localTags, setLocalTags] = useState(tags || []);
  const [localSort, setLocalSort] = useState<SearchSortMode>(selectedSort);
  const localYearsRef = useRef(localYears);
  const localTagsRef = useRef(localTags);
  const pendingQRef = useRef<string | null>(null);
  const pendingYearsRef = useRef<string | null>(null);
  const pendingTagsRef = useRef<string | null>(null);
  const pendingSortRef = useRef<SearchSortMode | null>(null);
  const fuseLoadPromiseRef = useRef<Promise<void> | null>(null);
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

  useEffect(() => {
    if (pendingSortRef.current && selectedSort !== pendingSortRef.current) return;
    pendingSortRef.current = null;
    setLocalSort(selectedSort);
  }, [selectedSort]);

  useEffect(() => {
    if (localQ || localSort === 'relevant') return;
    pendingSortRef.current = 'relevant';
    setLocalSort('relevant');
    void setFilters({ sort: null });
  }, [localQ, localSort, setFilters]);

  const loadFuse = useCallback(() => {
    if (fuse) return Promise.resolve();
    if (fuseLoadPromiseRef.current) return fuseLoadPromiseRef.current;

    setFuseLoading(true);
    const pending = import('fuse.js')
      .then(({ default: FuseClass }) => {
        setFuse(
          new FuseClass(items, {
            keys: fuseKeys,
            threshold,
            includeScore: true,
            getFn: (item, path) => readSearchField(item, resolveFusePath(path)).map((value) => normalizeSearchText(value)),
          }),
        );
      })
      .finally(() => {
        fuseLoadPromiseRef.current = null;
        setFuseLoading(false);
      });

    fuseLoadPromiseRef.current = pending;
    return pending;
  }, [fuse, items, fuseKeys, threshold]);

  useEffect(() => {
    if (!localQ || fuse) return;
    void loadFuse();
  }, [fuse, loadFuse, localQ]);

  useEffect(() => {
    if (fuse || typeof window === 'undefined') return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const preload = () => {
      if (!cancelled) void loadFuse();
    };

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(preload, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(preload, 1200);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [fuse, loadFuse]);

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
    return filterSearchItems({
      items,
      query: localQ,
      sort: localSort,
      yearSet,
      tagSet,
      fuseKeys,
      extractYear,
      extractTags,
      extractSortValue,
      matches: localQ && fuse ? fuse.search(normalizeSearchText(localQ)) : undefined,
    });
  }, [items, fuse, localQ, localSort, yearSet, tagSet, fuseKeys, extractSortValue, extractYear, extractTags]);

  const clearFilters = () => {
    pendingQRef.current = '';
    pendingYearsRef.current = '';
    pendingTagsRef.current = '';
    pendingSortRef.current = 'relevant';
    setLocalQ('');
    setLocalYears([]);
    setLocalTags([]);
    setLocalSort('relevant');
    setFilters({ q: null, year: null, tags: null, sort: null });
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
    sort: localSort,
    setSort: (value: SearchSortMode) => {
      pendingSortRef.current = value;
      setLocalSort(value);
      void setFilters({ sort: value === 'relevant' ? null : value });
    },
    fuseLoading: Boolean(localQ) && fuseLoading && !fuse,
    fuse,
    preloadSearch: () => {
      void loadFuse();
    },
    years,
    allTags,
    filtered,
    clearFilters,
  };
}
