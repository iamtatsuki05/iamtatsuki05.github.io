import React, { useCallback, useMemo } from 'react';
import { LOCATION_CHANGE_EVENT, notifyLocationChange } from '@/lib/compat/navigation';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterDisclosure } from '@/components/filters/FilterDisclosure';
import { FilterBar } from '@/components/filters/FilterBar';
import {
  buildBaseActiveFilters,
  buildBaseEmptyStateActions,
  FilterEmptyState,
  removeSetValue,
  SearchSortControls,
  toggleSetValue,
} from '@/components/filters/filterHelpers';
import {
  formatClearFilterLabel,
  formatFilterResultCount,
  formatRemoveFilterAriaLabel,
  resolveFilterText,
} from '@/components/filters/filterTexts';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { PublicationCard, type PublicationCardItem } from '@/components/publications/PublicationCard';
import { buildOrderedFacetValues } from '@/lib/search/filterMetadata';
import { type Locale, localeToRouteLocale } from '@/lib/i18n';

type Item = PublicationCardItem & {
  type: 'paper' | 'article' | 'talk' | 'slide' | 'media' | 'app';
  tags: string[];
};

const publicationTypeOrder: Item['type'][] = ['paper', 'app', 'article', 'talk', 'slide', 'media'];

const publicationTypeLabels: Record<Locale, Record<Item['type'], string>> = {
  ja: {
    paper: '📄 論文',
    article: '📝 技術ブログ',
    talk: '🎤 登壇',
    slide: '📑 スライド',
    media: '📰 メディア',
    app: '📱 アプリ',
  },
  en: {
    paper: '📄 Papers',
    article: '📝 Technical Articles',
    talk: '🎤 Talks',
    slide: '📑 Slides',
    media: '📰 Media',
    app: '📱 Apps',
  },
  zh: {
    paper: '📄 论文',
    article: '📝 技术博客',
    talk: '🎤 演讲',
    slide: '📑 幻灯片',
    media: '📰 媒体',
    app: '📱 应用',
  },
  fr: {
    paper: '📄 Articles scientifiques',
    article: '📝 Articles techniques',
    talk: '🎤 Présentations',
    slide: '📑 Slides',
    media: '📰 Médias',
    app: '📱 Apps',
  },
};

function isPublicationType(value: string): value is Item['type'] {
  return publicationTypeOrder.includes(value as Item['type']);
}

function readSelectedTypes() {
  if (typeof window === 'undefined') return publicationTypeOrder;
  const params = new URLSearchParams(window.location.search);
  const values = params.get('types')?.split(',').map((value) => value.trim()).filter(Boolean);
  return values?.length ? values : publicationTypeOrder;
}

function writeSelectedTypes(values: string[] | null) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (values?.length && values.length !== publicationTypeOrder.length) {
    params.set('types', values.join(','));
  } else {
    params.delete('types');
  }
  const query = params.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  notifyLocationChange();
}

function useSelectedPublicationTypes() {
  const [types, setTypes] = React.useState<string[]>(readSelectedTypes);

  React.useEffect(() => {
    const update = () => setTypes(readSelectedTypes());
    window.addEventListener('popstate', update);
    window.addEventListener(LOCATION_CHANGE_EVENT, update);
    update();
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(LOCATION_CHANGE_EVENT, update);
    };
  }, []);

  const setSelectedTypes = React.useCallback((next: string[] | null | ((prev: string[]) => string[])) => {
    setTypes((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      const normalized = resolved ?? publicationTypeOrder;
      writeSelectedTypes(normalized);
      return normalized;
    });
  }, []);

  return [types, setSelectedTypes] as const;
}

export function PublicationsClient({ items, locale = 'en' }: { items: Item[]; locale?: Locale }) {
  const [selectedTypes, setSelectedTypes] = useSelectedPublicationTypes();

  const availableTypes = useMemo(
    () => buildOrderedFacetValues(items, (item) => item.type, publicationTypeOrder),
    [items],
  );
  const availableTypeSet = useMemo(() => new Set(availableTypes), [availableTypes]);

  const {
    q,
    setQ,
    yearSet,
    setYearSet,
    tagSet,
    setTagSet,
    years,
    allTags,
    filtered,
    clearFilters,
    fuseLoading,
    preloadSearch,
    sort,
    setSort,
  } = useSearchFilters(items, {
    fuseKeys: ['title', 'tags', 'venue', 'publisher'],
    extractYear: (i) => i.publishedAt,
    extractTags: (i) => i.tags || [],
    extractSortValue: (i) => i.publishedAt,
  });

  const selectedTypeSet = useMemo(() => {
    return new Set(selectedTypes.filter((type): type is Item['type'] => isPublicationType(type) && availableTypeSet.has(type)));
  }, [selectedTypes, availableTypes, availableTypeSet]);
  const updateSelectedTypes = useCallback(
    (updater: (next: Set<Item['type']>) => void) => {
      setSelectedTypes((prev) => {
        const source = prev.length ? prev : availableTypes;
        const next = new Set(source.filter((type): type is Item['type'] => isPublicationType(type) && availableTypeSet.has(type)));
        updater(next);
        return Array.from(next);
      });
    },
    [availableTypeSet, availableTypes, setSelectedTypes],
  );

  const typeFiltered = useMemo(() => filtered.filter((i) => selectedTypeSet.has(i.type)), [filtered, selectedTypeSet]);

  const groups = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const it of typeFiltered) {
      (map[it.type] ||= []).push(it);
    }
    if (!q || sort === 'newest') {
      for (const k of Object.keys(map)) {
        map[k].sort((a, b) => ((a.publishedAt || '') < (b.publishedAt || '') ? 1 : -1));
      }
    }
    return map;
  }, [q, sort, typeFiltered]);
  const visibleTypes = useMemo(() => {
    if (q && sort === 'relevant') {
      return Array.from(new Set(typeFiltered.map((item) => item.type)));
    }

    return availableTypes.filter((type) => (groups[type] || []).length > 0);
  }, [availableTypes, groups, q, sort, typeFiltered]);

  const t = resolveFilterText(locale);
  const typeLabels = publicationTypeLabels[locale];
  const resultLabel = useMemo(
    () => formatFilterResultCount(locale, typeFiltered.length, items.length),
    [items.length, locale, typeFiltered.length],
  );
  const activeFilters = useMemo(() => {
    const filters = buildBaseActiveFilters({
      locale,
      query: q,
      yearSet,
      tagSet,
      onQueryClear: () => setQ(''),
      onYearRemove: (year) => setYearSet((prev) => removeSetValue(prev, year)),
      onTagRemove: (tag) => setTagSet((prev) => removeSetValue(prev, tag)),
    });

    if (selectedTypeSet.size !== availableTypes.length) {
      for (const type of availableTypes.filter((candidate) => selectedTypeSet.has(candidate))) {
        const label = typeLabels[type];
        filters.push({
          key: `type:${type}`,
          label,
          ariaLabel: formatRemoveFilterAriaLabel(locale, label),
          onRemove: () => updateSelectedTypes((next) => removeSetValue(next, type)),
        });
      }
    }

    return filters;
  }, [availableTypes, locale, q, selectedTypeSet, setQ, setTagSet, setYearSet, tagSet, typeLabels, updateSelectedTypes, yearSet]);
  const emptyStateActions = useMemo(() => {
    const actions = buildBaseEmptyStateActions({
      locale,
      query: q,
      hasYears: yearSet.size > 0,
      hasTags: tagSet.size > 0,
      onQueryClear: () => setQ(''),
      onYearsClear: () => setYearSet(new Set()),
      onTagsClear: () => setTagSet(new Set()),
      texts: t,
    });

    if (selectedTypeSet.size !== availableTypes.length) {
      actions.push({
        key: 'clear-types',
        label: formatClearFilterLabel(locale, t.types),
        onClick: () => setSelectedTypes(null),
      });
    }

    return actions;
  }, [availableTypes.length, locale, q, selectedTypeSet.size, setQ, setSelectedTypes, setTagSet, setYearSet, t, tagSet.size, yearSet.size]);

  const openInNewTab = (url: string) => {
    if (typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <FilterBar
        query={q}
        onQueryChange={setQ}
        onSearchIntent={preloadSearch}
        placeholder={t.search}
        onClear={() => {
          clearFilters();
          setSelectedTypes(null);
        }}
        clearLabel={t.clear}
        hasActiveFilters={Boolean(yearSet.size || tagSet.size || selectedTypeSet.size !== availableTypes.length)}
        isSearchLoading={fuseLoading}
        searchLoadingLabel={t.searching}
        resultLabel={resultLabel}
        activeFilters={activeFilters}
        sortControls={<SearchSortControls visible={Boolean(q)} sort={sort} onSortChange={setSort} texts={t} />}
        stickyMetaOnMobile
        voiceLang={localeToRouteLocale(locale)}
        voiceStartLabel={t.voiceStart}
        voiceStopLabel={t.voiceStop}
        voiceListeningLabel={t.voiceListening}
        voicePermissionMessage={t.voicePermission}
        voiceNoSpeechMessage={t.voiceNoSpeech}
        voiceUnavailableMessage={t.voiceUnavailable}
      >
        <YearSelect
          years={years}
          selected={yearSet}
          onToggle={(year) => setYearSet((prev) => toggleSetValue(prev, year))}
          onClear={() => setYearSet(new Set())}
          label={t.year}
          allLabel={t.all}
        />

        <FilterDisclosure
          label={t.types}
          count={availableTypes.length}
          selectedCount={selectedTypeSet.size}
          className="ml-2"
          panelClassName="max-h-56 overflow-y-auto"
          autoCloseOnSelect="mobile"
        >
          {({ requestCloseIfNeeded }) => (
            <div className="flex flex-col gap-1">
              {availableTypes.map((tp) => (
                <label key={tp} className="text-sm inline-flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedTypeSet.has(tp)}
                    onChange={() => {
                      requestCloseIfNeeded();
                      updateSelectedTypes((next) => toggleSetValue(next, tp));
                    }}
                  />
                  {typeLabels[tp]}
                </label>
              ))}
            </div>
          )}
        </FilterDisclosure>

        <TagSelector
          tags={allTags}
          selected={tagSet}
          onToggle={(tag) => setTagSet((prev) => toggleSetValue(prev, tag))}
          label={t.tags}
          className="ml-2"
        />
      </FilterBar>

      {visibleTypes.map((type) => {
        const arr = groups[type] || [];
        if (!arr.length) return null;
        const tone: 'lilac' | 'amber' | 'blue' | 'teal' =
          type === 'paper' ? 'lilac' : type === 'app' ? 'teal' : type === 'article' ? 'amber' : 'blue';
        return (
          <SectionShell key={type} tone={tone}>
            <SectionHeader title={typeLabels[type]} tone={tone} />
            <ul className="space-y-3">
              {arr.map((i, index) => (
                <PublicationCard
                  key={i.slug}
                  item={i}
                  query={q}
                  eagerImage={index === 0 && Boolean(i.headerImage)}
                  onOpen={openInNewTab}
                />
              ))}
            </ul>
          </SectionShell>
        );
      })}

      {typeFiltered.length === 0 && (
        <FilterEmptyState locale={locale} query={q} actions={emptyStateActions} />
      )}
    </div>
  );
}
