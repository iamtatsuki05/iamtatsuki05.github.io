"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/date';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterBar } from '@/components/filters/FilterBar';
import { formatClearFilterLabel, formatFilterResultCount, formatRemoveFilterAriaLabel, formatSearchChipLabel, resolveFilterText } from '@/components/filters/filterTexts';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { SearchHighlight } from '@/components/search/SearchHighlight';
import { useInitialReveal } from '@/hooks/useInitialReveal';

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_INCREMENT = 10;
const LATEST_POSTS_COUNT = 3;

type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  headerImage?: string;
  headerAlt?: string;
};

export function BlogsClient({ posts, locale = 'en' }: { posts: Post[]; locale?: 'ja' | 'en' }) {
  const [visible, setVisible] = useState(INITIAL_VISIBLE_COUNT);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const areCardsVisible = useInitialReveal(56);

  const {
    q,
    setQ,
    yearSet,
    setYearSet,
    tagSet,
    setTagSet,
    years: allYears,
    allTags,
    filtered,
    clearFilters,
    fuseLoading,
    preloadSearch,
  } = useSearchFilters(posts, {
    fuseKeys: ['title', 'summary', 'tags'],
    extractYear: (p) => p.date,
    extractTags: (p) => p.tags || [],
    extractSortValue: (p) => p.date,
  });

  useEffect(() => {
    setVisible(INITIAL_VISIBLE_COUNT);
  }, [filtered]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible((v) => Math.min(v + LOAD_MORE_INCREMENT, filtered.length));
          }
        });
      },
      { rootMargin: '200px' }, // 200px前にプリロード
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const latest = useMemo(() => filtered.slice(0, LATEST_POSTS_COUNT), [filtered]);
  const items = useMemo(() => filtered.slice(0, visible), [filtered, visible]);

  const t = useMemo(() => resolveFilterText(locale), [locale]);
  const resultLabel = useMemo(() => formatFilterResultCount(locale, filtered.length, posts.length), [filtered.length, locale, posts.length]);
  const activeFilters = useMemo(() => {
    const filters = [];

    if (q) {
      filters.push({
        key: `q:${q}`,
        label: formatSearchChipLabel(locale, q),
        ariaLabel: formatRemoveFilterAriaLabel(locale, formatSearchChipLabel(locale, q)),
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

    return filters;
  }, [locale, q, setQ, setTagSet, setYearSet, tagSet, yearSet]);
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

    return actions;
  }, [locale, q, setQ, setTagSet, setYearSet, t.searchKeyword, t.tags, t.year, tagSet.size, yearSet.size]);

  return (
    <div className="space-y-6">
      <FilterBar
        query={q}
        onQueryChange={setQ}
        onSearchIntent={preloadSearch}
        placeholder={t.search}
        onClear={() => {
          clearFilters();
        }}
        clearLabel={t.clear}
        hasActiveFilters={Boolean(yearSet.size || tagSet.size)}
        isSearchLoading={fuseLoading}
        searchLoadingLabel={t.searching}
        resultLabel={resultLabel}
        activeFilters={activeFilters}
      >
        <YearSelect
          years={allYears}
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

      <SectionShell tone="amber">
        <SectionHeader title={t.latest} tone="amber" />
        <ul className="content-reveal-list grid gap-3 sm:grid-cols-2" data-state={areCardsVisible ? 'open' : 'hidden'} data-testid="blog-latest-list">
          {latest.map((p, index) => (
            <li
              key={p.slug}
              className="content-reveal-card card blog-linked-card overflow-hidden"
              data-testid="blog-latest-card"
              style={areCardsVisible ? { transitionDelay: `${100 + index * 34}ms` } : undefined}
            >
              {p.headerImage ? (
                <div
                  className="blog-linked-card__media relative hidden h-24 w-full border-b border-gray-200 dark:border-gray-700 sm:block"
                  data-testid="blog-image"
                >
                  <Image
                    src={p.headerImage}
                    alt={p.headerAlt || p.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    priority={index === 0}
                  />
                </div>
              ) : null}
              <div className="p-3">
                <h3 className="font-medium">
                  <Link
                    href={`/blogs/${p.slug}/`}
                    className="blog-linked-card__title-link underline-offset-2 hover:underline"
                  >
                    <SearchHighlight text={p.title} query={q} />
                  </Link>
                </h3>
              <p className="text-xs opacity-70 mt-1">{formatDate(p.date, locale)}</p>
                {p.summary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
                    <SearchHighlight text={p.summary} query={q} />
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SectionShell>

      <SectionShell tone="lilac">
        <SectionHeader title={t.allPosts} tone="lilac" />
        {filtered.length === 0 ? (
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
        ) : (
          <ul className="content-reveal-list space-y-2" data-state={areCardsVisible ? 'open' : 'hidden'} data-testid="blog-all-list">
            {items.map((p, index) => (
              <li
                key={p.slug}
                className="content-reveal-card card blog-linked-card p-3 gap-3 items-start sm:flex"
                data-testid="blog-card"
                style={areCardsVisible ? { transitionDelay: `${140 + index * 22}ms` } : undefined}
              >
                {p.headerImage ? (
                  <div
                    className="blog-linked-card__media relative hidden h-36 w-full shrink-0 overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:block sm:h-20 sm:w-28"
                    data-testid="blog-image"
                  >
                    <Image
                      src={p.headerImage}
                      alt={p.headerAlt || p.title}
                      fill
                      className="object-contain"
                      sizes="120px"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                  <h3 className="text-base font-semibold">
                    <Link
                      href={`/blogs/${p.slug}/`}
                      className="blog-linked-card__title-link underline-offset-2 hover:underline"
                    >
                      <SearchHighlight text={p.title} query={q} />
                    </Link>
                  </h3>
                  <p className="text-xs opacity-70">{formatDate(p.date, locale)}</p>
                  {p.summary && (
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      <SearchHighlight text={p.summary} query={q} />
                    </p>
                  )}
                  {p.tags?.length ? (
                    <div className="mt-1 text-xs opacity-70 truncate">
                      <SearchHighlight text={p.tags.join(', ')} query={q} />
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div ref={loadMoreRef} className="h-8" />
      </SectionShell>
    </div>
  );
}
