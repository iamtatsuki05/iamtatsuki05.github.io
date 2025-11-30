"use client";
import React, { useMemo, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { parseAsArrayOf, parseAsStringEnum, useQueryState } from 'nuqs';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterBar } from '@/components/filters/FilterBar';
import { resolveFilterText } from '@/components/filters/filterTexts';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';

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

const typeOrder: Item['type'][] = ['paper', 'app', 'article', 'talk', 'slide', 'media'];

export function PublicationsClient({ items, locale = 'en' }: { items: Item[]; locale?: 'ja' | 'en' }) {
  const [selectedTypes, setSelectedTypes] = useQueryState(
    'types',
    parseAsArrayOf(parseAsStringEnum(typeOrder)).withDefault(typeOrder),
  );
  const {
    q,
    setQ,
    year,
    setYear,
    tagSet,
    setTagSet,
    years,
    allTags,
    filtered,
    clearFilters,
  } = useSearchFilters(items, {
    fuseKeys: ['title', 'tags', 'venue', 'publisher'],
    extractYear: (i) => i.publishedAt,
    extractTags: (i) => i.tags || [],
  });

  const selectedTypeSet = useMemo(
    () => new Set((selectedTypes || typeOrder).filter((t): t is Item['type'] => typeOrder.includes(t))),
    [selectedTypes],
  );

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
        hasActiveFilters={Boolean(year || tagSet.size || selectedTypeSet.size !== typeOrder.length)}
      >
        <YearSelect
          years={years}
          value={year}
          onChange={setYear}
          label={t.year}
        />

        <details className="ml-2">
          <summary className="cursor-pointer select-none text-sm opacity-80">
            {t.types} ({typeOrder.length})
          </summary>
          <div className="mt-2 flex flex-col gap-1">
            {typeOrder.map((tp) => (
              <label key={tp} className="text-sm inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedTypeSet.has(tp)}
                  onChange={() =>
                    void setSelectedTypes((prev) => {
                      const next = new Set(prev || typeOrder);
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
        </details>

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

      {typeOrder.map((type) => {
        const arr = groups[type] || [];
        if (!arr.length) return null;
        const tone: 'lilac' | 'amber' | 'blue' | 'teal' =
          type === 'paper' ? 'lilac' : type === 'app' ? 'teal' : type === 'article' ? 'amber' : 'blue';
        return (
          <SectionShell key={type} tone={tone}>
            <SectionHeader title={typeLabels[type]} tone={tone} />
            <ul className="space-y-3">
              {arr.map((i) => {
                const primaryLink = i.links[0]?.url;
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
                    className={`card p-3 gap-3 items-start sm:flex ${primaryLink ? 'cursor-pointer' : ''}`}
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
                      />
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0 mt-2 sm:mt-0">
                    <h3 className="text-base font-semibold">{i.title}</h3>
                    <p className="text-xs opacity-70">
                      {(i.publishedAt || '').slice(0, 10)} ・ {i.venue || i.publisher}
                    </p>
                    {i.abstract ? (
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {i.abstract}
                      </p>
                    ) : null}
                    {i.tags?.length ? (
                      <div className="flex flex-wrap gap-2 mt-1 text-xs opacity-70">
                        {i.tags.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-800">#{t}</span>
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

      {typeOrder.every((t) => !(groups[t] || []).length) && (
        <p className="opacity-70">{t.noResult}</p>
      )}
    </div>
  );
}
