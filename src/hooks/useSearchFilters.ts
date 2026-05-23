import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import type Fuse from 'fuse.js';
import { notifyLocationChange } from '@/lib/compat/navigation';
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

function readQueryState() {
  const params = typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search);
  const sort = params.get('sort');
  return {
    q: params.get('q') || '',
    year: parseList(params.get('year')),
    tags: parseList(params.get('tags')),
    sort: sort === 'newest' ? 'newest' as const : 'relevant' as const,
  };
}

function parseList(value: string | null) {
  return value?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? [];
}

function writeQueryState(next: Partial<ReturnType<typeof readQueryState>>) {
  if (typeof window === 'undefined') return;
  const current = readQueryState();
  const merged = { ...current, ...next };
  const params = new URLSearchParams(window.location.search);

  const setString = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };
  const setArray = (key: string, values: string[]) => {
    const normalized = values.map((value) => value.trim()).filter(Boolean);
    if (normalized.length) params.set(key, normalized.join(','));
    else params.delete(key);
  };

  setString('q', merged.q);
  setArray('year', merged.year);
  setArray('tags', merged.tags);
  if (merged.q && merged.sort === 'newest') params.set('sort', merged.sort);
  else params.delete('sort');

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
  window.history.replaceState(null, '', nextUrl);
  notifyLocationChange();
}

export function useSearchFilters<T>(
  items: T[],
  { fuseKeys, threshold = 0.35, extractYear, extractTags, extractSortValue }: Options<T>,
) {
  const [{ q, year: selectedYears, tags, sort: selectedSort }, setQueryState] = useState(readQueryState);
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
    const update = () => setQueryState(readQueryState());
    window.addEventListener('popstate', update);
    window.addEventListener('app-location-change', update);
    update();
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('app-location-change', update);
    };
  }, []);

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
    writeQueryState({ sort: 'relevant' });
  }, [localQ, localSort]);

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
    writeQueryState({ q: '', year: [], tags: [], sort: 'relevant' });
  };

  return {
    q: localQ,
    setQ: (value: string) => {
      const nextValue = value || '';
      pendingQRef.current = nextValue;
      setLocalQ(nextValue);
      writeQueryState({ q: nextValue });
    },
    yearSet,
    setYearSet: (next: SetUpdater<Set<string>>) => {
      const resolved = typeof next === 'function' ? next(new Set(localYearsRef.current)) : next;
      const normalized = Array.from(new Set(resolved)).sort((a, b) => (a < b ? 1 : -1));

      pendingYearsRef.current = serializeValues(normalized);
      setLocalYears(normalized);
      writeQueryState({ year: normalized });
    },
    tagSet,
    setTagSet: (next: SetUpdater<Set<string>>) => {
      const resolved = typeof next === 'function' ? next(new Set(localTagsRef.current)) : next;
      const normalized = Array.from(new Set(resolved)).sort();

      pendingTagsRef.current = serializeValues(normalized);
      setLocalTags(normalized);
      writeQueryState({ tags: normalized });
    },
    sort: localSort,
    setSort: (value: SearchSortMode) => {
      pendingSortRef.current = value;
      setLocalSort(value);
      writeQueryState({ sort: value });
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
