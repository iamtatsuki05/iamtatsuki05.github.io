"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/date';
import { withBasePath } from '@/lib/url';
import { useSearchFilters } from '@/hooks/useSearchFilters';

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

  const t = (key: string) => {
    const ja: Record<string, string> = {
      search: '検索...',
      latest: '✨ 最新',
      allPosts: '🗂 すべての記事',
      noResult: '該当する記事がありません',
      year: '年',
      tags: 'タグ',
      clear: 'クリア',
    };
    const en: Record<string, string> = {
      search: 'Search...',
      latest: '✨ Latest',
      allPosts: '🗂 All Posts',
      noResult: 'No posts found',
      year: 'Year',
      tags: 'Tags',
      clear: 'Clear',
    };
    return (locale === 'ja' ? ja : en)[key];
  };

  return (
    <div className="space-y-6">
      <input
        aria-label={t('search')}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('search')}
        className="w-full border rounded-sm px-3 py-2 dark:border-gray-700"
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm opacity-70">{t('year')}</label>
        <select value={year} onChange={(e)=>setYear(e.target.value)} className="border rounded-sm px-2 py-1 dark:border-gray-700">
          <option value="">All</option>
          {allYears.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <details className="ml-2">
          <summary className="cursor-pointer select-none text-sm opacity-80">
            {t('tags')} ({allTags.length})
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = tagSet.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    const next = new Set(tagSet);
                    if (active) next.delete(tag);
                    else next.add(tag);
                    setTagSet(next);
                  }}
                  className={`px-2 py-0.5 rounded-sm text-sm border ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </details>
        {(year || tagSet.size || q) ? (
          <button onClick={()=>{ clearFilters(); }} className="ml-auto text-sm underline">
            {t('clear')}
          </button>
        ) : null}
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-2">{t('latest')}</h2>
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
        <h2 className="text-xl font-semibold mb-2">{t('allPosts')}</h2>
        {items.length === 0 ? (
          <p className="opacity-70">{t('noResult')}</p>
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
