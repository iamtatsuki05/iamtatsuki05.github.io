"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date';
import { withBasePath } from '@/lib/url';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterBar } from '@/components/filters/FilterBar';
import { resolveFilterText } from '@/components/filters/filterTexts';

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
  const [visible, setVisible] = useState(10);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    q,
    setQ,
    year,
    setYear,
    tagSet,
    setTagSet,
    years: allYears,
    allTags,
    filtered,
    clearFilters,
  } = useSearchFilters(posts, {
    fuseKeys: ['title', 'summary', 'tags'],
    extractYear: (p) => p.date,
    extractTags: (p) => p.tags || [],
  });

  useEffect(() => {
    setVisible(10);
  }, [filtered]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setVisible((v) => Math.min(v + 10, filtered.length));
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const latest = filtered.slice(0, 3);
  const items = filtered.slice(0, visible);

  const t = resolveFilterText(locale);

  return (
    <div className="space-y-6">
      <FilterBar
        query={q}
        onQueryChange={setQ}
        placeholder={t.search}
        onClear={() => {
          clearFilters();
        }}
        clearLabel={t.clear}
        hasActiveFilters={Boolean(year || tagSet.size)}
      >
        <YearSelect
          years={allYears}
          value={year}
          onChange={setYear}
          label={t.year}
        />

        <TagSelector
          tags={allTags}
          selected={tagSet}
          onToggle={(tag) => {
            const next = new Set(tagSet);
            if (next.has(tag)) next.delete(tag);
            else next.add(tag);
            setTagSet(next);
          }}
          label={t.tags}
          className="ml-2"
        />
      </FilterBar>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.latest}</h2>
        <ul className="grid gap-3 sm:grid-cols-2" data-testid="blog-latest-list">
          {latest.map((p) => (
            <li key={p.slug} className="card overflow-hidden" data-testid="blog-latest-card">
              {p.headerImage ? (
                <img
                  src={withBasePath(p.headerImage)}
                  alt={p.headerAlt || p.title}
                  className="w-full h-24 object-cover border-b border-gray-200 dark:border-gray-700"
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              <div className="p-3">
                <h3 className="font-medium">
                  <Link href={`/blogs/${p.slug}/`} className="underline-offset-2 hover:underline">
                    {p.title}
                  </Link>
                </h3>
              <p className="text-xs opacity-70 mt-1">{formatDate(p.date, locale)}</p>
                {p.summary && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">{p.summary}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t.allPosts}</h2>
        {items.length === 0 ? (
          <p className="opacity-70">{t.noResult}</p>
        ) : (
          <ul className="space-y-2" data-testid="blog-all-list">
            {items.map((p) => (
              <li key={p.slug} className="card p-3 gap-3 items-start sm:flex" data-testid="blog-card">
                {p.headerImage ? (
                  <div className="sm:w-28 sm:h-20 w-full h-36 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={withBasePath(p.headerImage)}
                      alt={p.headerAlt || p.title}
                      className="max-w-full max-h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}
                <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                  <h3 className="text-base font-semibold">
                    <Link href={`/blogs/${p.slug}/`} className="underline-offset-2 hover:underline">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="text-xs opacity-70">{formatDate(p.date, locale)}</p>
                  {p.summary && <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{p.summary}</p>}
                  {p.tags?.length ? (
                    <div className="mt-1 text-xs opacity-70 truncate">{p.tags.join(', ')}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div ref={loadMoreRef} className="h-8" />
      </section>
    </div>
  );
}
