"use client";
import React, { useMemo, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { parseAsArrayOf, parseAsStringEnum, useQueryState } from 'nuqs';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterDisclosure } from '@/components/filters/FilterDisclosure';
import { FilterBar } from '@/components/filters/FilterBar';
import { formatClearFilterLabel, formatFilterResultCount, formatRemoveFilterAriaLabel, formatSearchChipLabel, resolveFilterText } from '@/components/filters/filterTexts';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { SearchHighlight } from '@/components/search/SearchHighlight';
import { buildOrderedFacetValues } from '@/lib/search/filterMetadata';
import { useInitialReveal } from '@/hooks/useInitialReveal';

type Item = {
  slug: string;
  title: string;
  type: 'paper' | 'article' | 'talk' | 'slide' | 'media' | 'app';
  tags: string[];
  publishedAt?: string;
  venue?: string;
  publisher?: string;
  links: { kind: string; url: string }[];
  headerImage?: string;
  headerAlt?: string;
  abstract?: string;
};

const publicationTypeOrder: Item['type'][] = ['paper', 'app', 'article', 'talk', 'slide', 'media'];

export function PublicationsClient({ items, locale = 'en' }: { items: Item[]; locale?: 'ja' | 'en' }) {
  const areCardsVisible = useInitialReveal(56);
  const [selectedTypes, setSelectedTypes] = useQueryState(
    'types',
    parseAsArrayOf(parseAsStringEnum(publicationTypeOrder)).withDefault(publicationTypeOrder),
  );

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
  } = useSearchFilters(items, {
    fuseKeys: ['title', 'tags', 'venue', 'publisher'],
    extractYear: (i) => i.publishedAt,
    extractTags: (i) => i.tags || [],
  });

  const selectedTypeSet = useMemo(() => {
    const source = selectedTypes ?? availableTypes;
    return new Set(source.filter((type): type is Item['type'] => availableTypeSet.has(type)));
  }, [selectedTypes, availableTypes, availableTypeSet]);

  const typeFiltered = useMemo(() => filtered.filter((i) => selectedTypeSet.has(i.type)), [filtered, selectedTypeSet]);

  const groups = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const it of typeFiltered) {
      (map[it.type] ||= []).push(it);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => ((a.publishedAt || '') < (b.publishedAt || '') ? 1 : -1));
    }
    return map;
  }, [typeFiltered]);

  const t = resolveFilterText(locale);
  const typeLabels: Record<Item['type'], string> = locale === 'ja'
    ? {
        paper: '📄 論文',
        article: '📝 技術ブログ',
        talk: '🎤 登壇',
        slide: '📑 スライド',
        media: '📰 メディア',
        app: '📱 アプリ',
      }
    : {
        paper: '📄 Papers',
        article: '📝 Technical Articles',
        talk: '🎤 Talks',
        slide: '📑 Slides',
        media: '📰 Media',
        app: '📱 Apps',
      };
  const resultLabel = useMemo(
    () => formatFilterResultCount(locale, typeFiltered.length, items.length),
    [items.length, locale, typeFiltered.length],
  );
  const activeFilters = useMemo(() => {
    const filters = [];

    if (q) {
      const label = formatSearchChipLabel(locale, q);
      filters.push({
        key: `q:${q}`,
        label,
        ariaLabel: formatRemoveFilterAriaLabel(locale, label),
        onRemove: () => setQ(''),
      });
    }

    for (const year of Array.from(yearSet).sort((a, b) => (a < b ? 1 : -1))) {
      filters.push({
        key: `year:${year}`,
        label: year,
        ariaLabel: formatRemoveFilterAriaLabel(locale, year),
        onRemove: () => setYearSet((prev) => {
          prev.delete(year);
          return prev;
        }),
      });
    }

    for (const tag of Array.from(tagSet).sort()) {
      const label = `#${tag}`;
      filters.push({
        key: `tag:${tag}`,
        label,
        ariaLabel: formatRemoveFilterAriaLabel(locale, label),
        onRemove: () => setTagSet((prev) => {
          prev.delete(tag);
          return prev;
        }),
      });
    }

    if (selectedTypeSet.size !== availableTypes.length) {
      for (const type of availableTypes.filter((candidate) => selectedTypeSet.has(candidate))) {
        const label = typeLabels[type];
        filters.push({
          key: `type:${type}`,
          label,
          ariaLabel: formatRemoveFilterAriaLabel(locale, label),
          onRemove: () =>
            void setSelectedTypes((prev) => {
              const source = prev ?? availableTypes;
              const next = new Set(source.filter((value): value is Item['type'] => availableTypeSet.has(value)));
              next.delete(type);
              return Array.from(next);
            }),
        });
      }
    }

    return filters;
  }, [availableTypeSet, availableTypes, items.length, locale, q, selectedTypeSet, setQ, setSelectedTypes, setTagSet, setYearSet, tagSet, typeLabels, yearSet]);
  const emptyStateActions = useMemo(() => {
    const actions = [];

    if (q) {
      actions.push({
        key: 'clear-search',
        label: formatClearFilterLabel(locale, t.searchKeyword),
        onClick: () => setQ(''),
      });
    }

    if (yearSet.size) {
      actions.push({
        key: 'clear-years',
        label: formatClearFilterLabel(locale, t.year),
        onClick: () => setYearSet(new Set()),
      });
    }

    if (tagSet.size) {
      actions.push({
        key: 'clear-tags',
        label: formatClearFilterLabel(locale, t.tags),
        onClick: () => setTagSet(new Set()),
      });
    }

    if (selectedTypeSet.size !== availableTypes.length) {
      actions.push({
        key: 'clear-types',
        label: formatClearFilterLabel(locale, t.types),
        onClick: () => {
          void setSelectedTypes(null);
        },
      });
    }

    return actions;
  }, [availableTypes.length, locale, q, selectedTypeSet.size, setQ, setSelectedTypes, setTagSet, setYearSet, t.searchKeyword, t.tags, t.types, t.year, tagSet.size, yearSet.size]);

  const openInNewTab = (url?: string) => {
    if (!url || typeof window === 'undefined') return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKey = (event: KeyboardEvent<HTMLLIElement>, url?: string) => {
    if (!url) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openInNewTab(url);
    }
  };

  return (
    <div className="space-y-6">
      <FilterBar
        query={q}
        onQueryChange={setQ}
        placeholder={t.search}
        onClear={() => {
          clearFilters();
          void setSelectedTypes(null);
        }}
        clearLabel={t.clear}
        hasActiveFilters={Boolean(yearSet.size || tagSet.size || selectedTypeSet.size !== availableTypes.length)}
        isSearchLoading={fuseLoading}
        searchLoadingLabel={t.searching}
        resultLabel={resultLabel}
        activeFilters={activeFilters}
      >
        <YearSelect
          years={years}
          selected={yearSet}
          onToggle={(year) =>
            setYearSet((prev) => {
              if (prev.has(year)) prev.delete(year);
              else prev.add(year);
              return prev;
            })}
          onClear={() => setYearSet(new Set())}
          label={t.year}
          allLabel={t.all}
        />

        <FilterDisclosure label={t.types} count={availableTypes.length} className="ml-2" panelClassName="max-h-56 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {availableTypes.map((tp) => (
              <label key={tp} className="text-sm inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedTypeSet.has(tp)}
                  onChange={() =>
                    void setSelectedTypes((prev) => {
                      const source = prev ?? availableTypes;
                      const next = new Set(source.filter((type): type is Item['type'] => availableTypeSet.has(type)));
                      if (next.has(tp)) next.delete(tp);
                      else next.add(tp);
                      return Array.from(next);
                    })
                  }
                />
                {typeLabels[tp]}
              </label>
            ))}
          </div>
        </FilterDisclosure>

        <TagSelector
          tags={allTags}
          selected={tagSet}
          onToggle={(tag) =>
            setTagSet((prev) => {
              if (prev.has(tag)) prev.delete(tag);
              else prev.add(tag);
              return prev;
            })}
          label={t.tags}
          className="ml-2"
        />
      </FilterBar>

      {availableTypes.map((type) => {
        const arr = groups[type] || [];
        if (!arr.length) return null;
        const tone: 'lilac' | 'amber' | 'blue' | 'teal' =
          type === 'paper' ? 'lilac' : type === 'app' ? 'teal' : type === 'article' ? 'amber' : 'blue';
        return (
          <SectionShell key={type} tone={tone}>
            <SectionHeader title={typeLabels[type]} tone={tone} />
            <ul className="content-reveal-list space-y-3" data-state={areCardsVisible ? 'open' : 'hidden'}>
              {arr.map((i, index) => {
                const primaryLink = i.links[0]?.url;
                const isFirstImage = index === 0 && Boolean(i.headerImage);
                const clickableProps = primaryLink
                  ? {
                      role: 'link' as const,
                      tabIndex: 0,
                      onClick: () => openInNewTab(primaryLink),
                      onKeyDown: (event: KeyboardEvent<HTMLLIElement>) => handleKey(event, primaryLink),
                    }
                  : {};
                return (
                  <li
                    key={i.slug}
                    data-testid="publication-card"
                    className={`content-reveal-card card p-3 gap-3 items-start sm:flex ${primaryLink ? 'pressable-card cursor-pointer' : ''}`}
                    style={areCardsVisible ? { transitionDelay: `${100 + index * 24}ms` } : undefined}
                    {...clickableProps}
                  >
                    {i.headerImage ? (
                      <div
                        className="relative hidden h-36 w-full shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:block sm:h-20 sm:w-28"
                        data-testid="publication-image"
                      >
                        <Image
                          src={i.headerImage}
                          alt={i.headerAlt || i.title}
                          fill
                          className="object-contain"
                          sizes="120px"
                          loading={isFirstImage ? 'eager' : 'lazy'}
                          priority={isFirstImage}
                        />
                      </div>
                    ) : null}
                    <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                      <h3 className="text-base font-semibold">
                        <SearchHighlight text={i.title} query={q} />
                      </h3>
                      <p className="text-xs opacity-70">
                        {(i.publishedAt || '').slice(0, 10)} ・{' '}
                        <SearchHighlight text={i.venue || i.publisher || ''} query={q} />
                      </p>
                      {i.abstract ? (
                        <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          <SearchHighlight text={i.abstract} query={q} />
                        </p>
                      ) : null}
                      {i.tags?.length ? (
                        <div className="flex flex-wrap gap-2 mt-1 text-xs opacity-70">
                          {i.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800">
                              #<SearchHighlight text={t} query={q} />
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-1 space-x-2 text-sm">
                        {i.links.map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {l.kind}
                          </a>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionShell>
        );
      })}

      {typeFiltered.length === 0 && (
        <div className="search-empty-state space-y-3" data-testid="filter-empty-state">
          <p className="opacity-70">{t.noResult}</p>
          {emptyStateActions.length ? (
            <div className="search-empty-actions">
              {emptyStateActions.map((action) => (
                <button
                  key={action.key}
                  type="button"
                  onClick={action.onClick}
                  className="search-empty-action ui-cta"
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
