"use client";

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

type TocItem = { id: string; text: string; level: number };

type Props = {
  containerId?: string;
  className?: string;
};

// シンプルなクライアントサイド目次。h2/h3のidはrehype-slugで付与済みを前提。
export function BlogToc({ containerId = 'blog-article', className }: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const headers = Array.from(root.querySelectorAll<HTMLHeadingElement>('h2, h3'));
    const next = headers
      .map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: Number(el.tagName.replace('H', '')),
      }))
      .filter((h) => h.id);
    setItems(next);
    if (next[0]?.id) setActiveId(next[0].id);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    headers.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [containerId]);

  if (!items.length) return null;

  return (
    <aside
      className={clsx(
        'hidden lg:block rounded-xl border border-purple-100/70 bg-white/80 p-4 text-base text-gray-800 shadow-sm shadow-purple-100/50',
        'dark:border-purple-500/30 dark:bg-[#0f172a] dark:text-gray-100 dark:shadow-purple-900/30',
        'sticky top-24 max-h-[70vh] overflow-auto',
        className,
      )}
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-200">
        目次
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-3 text-sm' : ''}>
            <a
              href={`#${item.id}`}
              className={clsx(
                'block truncate rounded-md px-2 py-1 underline-offset-2 transition',
                item.level === 3 ? 'text-sm' : 'text-base',
                activeId === item.id
                  ? 'bg-purple-50 text-purple-800 border border-purple-200 dark:bg-[#1c1430] dark:text-purple-100 dark:border-purple-500/40'
                  : 'text-gray-800 hover:underline dark:text-gray-100',
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
