"use client";

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type TocItem = { id: string; text: string; level: number };

type Props = {
  containerId?: string;
  className?: string;
};

const ACTIVE_OFFSET = 136;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function BlogToc({ containerId = 'blog-article', className }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const desktopListRef = useRef<HTMLUListElement>(null);
  const floatingListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const headers = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2, h3')).filter((heading) => heading.id);
    const next = headers
      .map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: Number(el.tagName.replace('H', '')),
      }));
    setItems(next);
    if (!next.length) return;

    let headingTops: Array<{ id: string; top: number }> = [];
    let rafId: number | null = null;

    const measure = () => {
      headingTops = headers.map((el) => ({
        id: el.id,
        top: el.getBoundingClientRect().top + window.scrollY,
      }));
    };

    const update = () => {
      const y = window.scrollY + ACTIVE_OFFSET;
      let nextActive = headingTops[0]?.id ?? null;
      for (const heading of headingTops) {
        if (heading.top > y) break;
        nextActive = heading.id;
      }

      const articleTop = root.getBoundingClientRect().top + window.scrollY;
      const articleBottom = articleTop + root.offsetHeight;
      const end = Math.max(articleTop + 1, articleBottom - window.innerHeight * 0.35);
      const nextProgress = clamp((y - articleTop) / Math.max(1, end - articleTop), 0, 1);

      setActiveId((prev) => (prev === nextActive ? prev : nextActive));
      setProgress((prev) => (Math.abs(prev - nextProgress) < 0.005 ? prev : nextProgress));
    };

    const requestUpdate = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    const handleResize = () => {
      measure();
      requestUpdate();
    };

    measure();
    requestUpdate();

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', handleResize);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => handleResize()) : null;
    resizeObserver?.observe(root);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();
    };
  }, [containerId]);

  useEffect(() => {
    if (!activeId) return;
    const listRoot = isFloatingOpen ? floatingListRef.current : desktopListRef.current;
    const links = listRoot?.querySelectorAll<HTMLAnchorElement>('a[data-toc-id]');
    const current = Array.from(links ?? []).find((link) => link.dataset.tocId === activeId);
    if (typeof current?.scrollIntoView === 'function') {
      current.scrollIntoView({ block: 'nearest' });
    }
  }, [activeId, isFloatingOpen]);

  useEffect(() => {
    if (!isFloatingOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFloatingOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFloatingOpen]);

  if (!items.length) return null;

  const tocStyle = { '--toc-item-count': String(items.length) } as React.CSSProperties;
  const handleFloatingClose = () => setIsFloatingOpen(false);

  return (
    <>
      <aside
        data-testid="blog-toc"
        style={tocStyle}
        className={clsx(
          'hidden rounded-2xl border border-purple-200/70 bg-linear-to-b from-white/95 to-purple-50/60 p-4 text-base text-gray-800 shadow-lg shadow-purple-100/30 backdrop-blur-sm lg:block lg:self-start',
          'dark:border-purple-500/35 dark:from-[#130d24] dark:to-[#0f172a]/95 dark:text-gray-100 dark:shadow-purple-900/40',
          'sticky top-24 max-h-[min(calc(100vh-7rem),calc(7.5rem+var(--toc-item-count)*2.5rem))] overflow-y-auto overscroll-contain',
          className,
        )}
      >
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200">
          目次
          <span className="ml-2 rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-500/20 dark:text-purple-100">
            {items.length}
          </span>
        </p>
        <div className="mb-3 h-1.5 rounded-full bg-purple-100/80 dark:bg-purple-900/40">
          <span
            data-testid="blog-toc-progress"
            className="block h-full rounded-full bg-linear-to-r from-amber-300 to-purple-500 transition-[width] duration-150 motion-reduce:transition-none"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <ul ref={desktopListRef} className="space-y-1.5">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? 'pl-3 text-sm' : ''}>
              <a
                data-toc-id={item.id}
                aria-current={activeId === item.id ? 'true' : undefined}
                href={`#${item.id}`}
                className={clsx(
                  'flex items-center gap-2 truncate rounded-lg border border-transparent px-2 py-1.5 underline-offset-2 transition motion-reduce:transition-none',
                  item.level === 3 ? 'text-sm' : 'text-base',
                  activeId === item.id
                    ? 'bg-purple-100/80 text-purple-900 shadow-sm shadow-purple-200/50 dark:border-purple-500/40 dark:bg-[#21163a] dark:text-purple-100'
                    : 'text-gray-800 hover:bg-purple-50/80 hover:underline dark:text-gray-100 dark:hover:bg-[#1a2439]',
                )}
              >
                <span
                  className={clsx(
                    'h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300 transition-colors dark:bg-purple-700',
                    activeId === item.id && 'bg-purple-500 dark:bg-purple-300',
                  )}
                />
                <span className="truncate">{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      <button
        type="button"
        data-testid="blog-toc-fab"
        aria-controls="blog-toc-sheet"
        aria-expanded={isFloatingOpen}
        aria-label={isFloatingOpen ? '目次を閉じる' : '目次を開く'}
        onClick={() => setIsFloatingOpen((prev) => !prev)}
        className={clsx(
          'fixed top-24 right-5 z-40 hidden rounded-full border border-purple-300/80 bg-white/95 px-4 py-2 text-sm font-semibold text-purple-800 shadow-lg shadow-purple-200/60 backdrop-blur-sm transition hover:bg-purple-50 motion-reduce:transition-none md:inline-flex lg:hidden dark:border-purple-500/50 dark:bg-[#171126]/95 dark:text-purple-100 dark:hover:bg-[#21163a]',
          isFloatingOpen && 'pointer-events-none opacity-0',
        )}
      >
        目次
      </button>

      {isFloatingOpen ? (
        <>
          <button
            type="button"
            aria-label="目次を閉じる"
            onClick={handleFloatingClose}
            className="fixed inset-0 z-40 hidden bg-black/30 md:block lg:hidden"
          />
          <section
            id="blog-toc-sheet"
            data-testid="blog-toc-sheet"
            className="fixed top-36 right-4 left-4 z-50 hidden max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain rounded-2xl border border-purple-200/70 bg-linear-to-b from-white/95 to-purple-50/80 p-4 shadow-2xl shadow-purple-300/25 backdrop-blur-sm md:left-auto md:w-[min(22rem,calc(100vw-2rem))] md:block lg:hidden dark:border-purple-500/35 dark:from-[#130d24] dark:to-[#111a2d]/95"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200">
                目次
              </p>
              <button
                type="button"
                onClick={handleFloatingClose}
                className="rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-purple-100 dark:text-gray-200 dark:hover:bg-[#2d2445]"
              >
                閉じる
              </button>
            </div>
            <ul ref={floatingListRef} className="space-y-1.5">
              {items.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-3 text-sm' : ''}>
                  <a
                    data-toc-id={item.id}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    href={`#${item.id}`}
                    onClick={handleFloatingClose}
                    className={clsx(
                      'flex items-center gap-2 truncate rounded-lg border border-transparent px-2 py-1.5 underline-offset-2 transition motion-reduce:transition-none',
                      item.level === 3 ? 'text-sm' : 'text-base',
                      activeId === item.id
                        ? 'bg-purple-100/80 text-purple-900 shadow-sm shadow-purple-200/50 dark:border-purple-500/40 dark:bg-[#21163a] dark:text-purple-100'
                        : 'text-gray-800 hover:bg-purple-50/80 hover:underline dark:text-gray-100 dark:hover:bg-[#1a2439]',
                    )}
                  >
                    <span
                      className={clsx(
                        'h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300 transition-colors dark:bg-purple-700',
                        activeId === item.id && 'bg-purple-500 dark:bg-purple-300',
                      )}
                    />
                    <span className="truncate">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : null}
    </>
  );
}
