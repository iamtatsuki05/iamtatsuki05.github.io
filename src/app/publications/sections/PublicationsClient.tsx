"use client";
import { useMemo, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { YearSelect } from '@/components/filters/YearSelect';
import { TagSelector } from '@/components/filters/TagSelector';
import { FilterBar } from '@/components/filters/FilterBar';
import { resolveFilterText } from '@/components/filters/filterTexts';

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

export function PublicationsClient({ items, locale = 'en' }: { items: Item[]; locale?: 'ja' | 'en' }) {
  const [types, setTypes] = useState<Record<Item['type'], boolean>>({
    paper: true,
    article: true,
    talk: true,
    slide: true,
    media: true,
    app: true,
  });
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

  const typeFiltered = useMemo(() => filtered.filter((i) => types[i.type]), [filtered, types]);

  const order: Item['type'][] = ['paper', 'app', 'article', 'talk', 'slide', 'media'];
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
          setTypes({ paper: true, article: true, talk: true, slide: true, media: true, app: true });
        }}
        clearLabel={t.clear}
        hasActiveFilters={Boolean(year || tagSet.size || Object.values(types).some((v) => !v))}
      >
        <YearSelect
          years={years}
          value={year}
          onChange={setYear}
          label={t.year}
        />

        <details className="ml-2">
          <summary className="cursor-pointer select-none text-sm opacity-80">
            {t.types} ({order.length})
          </summary>
          <div className="mt-2 flex flex-col gap-1">
            {order.map((tp) => (
              <label key={tp} className="text-sm inline-flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={types[tp]}
                  onChange={() => setTypes({ ...types, [tp]: !types[tp] })}
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

      {order.map((type) => {
        const arr = groups[type] || [];
        if (!arr.length) return null;
        return (
          <section key={type} className="space-y-3">
            <h2 className="text-xl font-semibold">{typeLabels[type]}</h2>
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
                  <div className="relative sm:w-28 sm:h-20 w-full h-36 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shrink-0">
                    <Image
                      src={i.headerImage}
                      alt={i.headerAlt || i.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, 120px"
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
          </section>
        );
      })}

      {order.every((t) => !(groups[t] || []).length) && (
        <p className="opacity-70">{t.noResult}</p>
      )}
    </div>
  );
}
