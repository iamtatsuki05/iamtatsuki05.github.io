"use client";
import { useMemo, useState, type KeyboardEvent } from 'react';
import Fuse from 'fuse.js';
import { withBasePath } from '@/lib/url';

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
  const [q, setQ] = useState('');
  const [year, setYear] = useState<string>('');
  const [types, setTypes] = useState<Record<Item['type'], boolean>>({
    paper: true,
    article: true,
    talk: true,
    slide: true,
    media: true,
    app: true,
  });
  const [tagSet, setTagSet] = useState<Set<string>>(new Set());

  const fuse = useMemo(
    () => new Fuse(items, { keys: ['title', 'tags', 'venue', 'publisher'], threshold: 0.35 }),
    [items],
  );

  const years = useMemo(
    () => Array.from(new Set(items.map((i) => (i.publishedAt || '').slice(0, 4))).values())
      .filter(Boolean)
      .sort((a, b) => (a < b ? 1 : -1)),
    [items],
  );
  const allTags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags || []))).sort(), [items]);

  const filtered = useMemo(() => {
    let r = q ? fuse.search(q).map((x) => x.item) : items;
    r = r.filter((i) => types[i.type]);
    if (year) r = r.filter((i) => (i.publishedAt || '').startsWith(year));
    if (tagSet.size) r = r.filter((i) => (i.tags || []).some((t) => tagSet.has(t)));
    return r;
  }, [items, fuse, q, year, types, tagSet]);

  const order: Item['type'][] = ['paper', 'app', 'article', 'talk', 'slide', 'media'];
  const groups = useMemo(() => {
    const map: Record<string, Item[]> = {};
    for (const it of filtered) {
      (map[it.type] ||= []).push(it);
    }
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => ((a.publishedAt || '') < (b.publishedAt || '') ? 1 : -1));
    }
    return map;
  }, [filtered]);

  const t = (key: string) => {
    const ja: Record<string, string> = {
      search: '検索...',
      paper: '📄 論文',
      article: '📝 技術ブログ',
      talk: '🎤 登壇',
      slide: '📑 スライド',
      media: '📰 メディア',
      app: '📱 アプリ',
      year: '年',
      types: '種類',
      tags: 'タグ',
      clear: 'クリア',
      noResult: '該当する項目がありません',
    };
    const en: Record<string, string> = {
      search: 'Search...',
      paper: '📄 Papers',
      article: '📝 Technical Articles',
      talk: '🎤 Talks',
      slide: '📑 Slides',
      media: '📰 Media',
      app: '📱 Apps',
      year: 'Year',
      types: 'Types',
      tags: 'Tags',
      clear: 'Clear',
      noResult: 'No items found',
    };
    return (locale === 'ja' ? ja : en)[key];
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
          {years.map((y)=> <option key={y} value={y}>{y}</option>)}
        </select>

        <span className="text-sm opacity-70">{t('types')}</span>
        {order.map((tp) => (
          <label key={tp} className="text-sm inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={types[tp]}
              onChange={() => setTypes({ ...types, [tp]: !types[tp] })}
            />
            {t(tp)}
          </label>
        ))}

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

        {(q || year || tagSet.size || Object.values(types).some(v=>!v)) ? (
          <button onClick={()=>{ setQ(''); setYear(''); setTagSet(new Set()); setTypes({paper:true,article:true,talk:true,slide:true,media:true,app:true}); }} className="ml-auto text-sm underline">
            {t('clear')}
          </button>
        ) : null}
      </div>

      {order.map((type) => {
        const arr = groups[type] || [];
        if (!arr.length) return null;
        return (
          <section key={type} className="space-y-3">
            <h2 className="text-xl font-semibold">{t(type)}</h2>
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
                    className={`card p-3 gap-3 items-start sm:flex ${primaryLink ? 'cursor-pointer' : ''}`}
                    {...clickableProps}
                  >
                  {i.headerImage ? (
                    <div className="sm:w-28 sm:h-20 w-full h-36 rounded-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBasePath(i.headerImage)}
                        alt={i.headerAlt || i.title}
                        className="max-w-full max-h-full object-contain"
                        loading="lazy"
                        decoding="async"
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
        <p className="opacity-70">{t('noResult')}</p>
      )}
    </div>
  );
}
