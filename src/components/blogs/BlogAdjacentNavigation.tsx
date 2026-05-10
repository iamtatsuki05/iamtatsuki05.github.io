"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

export type BlogAdjacentLink = {
  title: string;
  href: string;
};

export function BlogAdjacentNavigation({
  previous,
  next,
}: {
  previous: BlogAdjacentLink | null;
  next: BlogAdjacentLink | null;
}) {
  const router = useRouter();
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;

    const target = deltaX < 0 ? next : previous;
    if (target) router.push(target.href);
  };

  return (
    <nav
      aria-label="記事の前後ナビゲーション"
      className="not-prose mt-12 touch-pan-y border-t border-gray-200 pt-6 dark:border-gray-700"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        data-testid="blog-adjacent-mobile-swipe"
        className="flex items-center justify-between gap-4 px-1 py-2 sm:hidden"
      >
        <SwipeArrow direction="previous" enabled={Boolean(previous)} />
        <span className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
        <SwipeArrow direction="next" enabled={Boolean(next)} />
      </div>
      <div data-testid="blog-adjacent-desktop-links" className="hidden gap-3 sm:grid sm:grid-cols-2">
        <AdjacentItem direction="previous" item={previous} />
        <AdjacentItem direction="next" item={next} />
      </div>
    </nav>
  );
}

function SwipeArrow({
  direction,
  enabled,
}: {
  direction: 'previous' | 'next';
  enabled: boolean;
}) {
  const label = direction === 'previous' ? '前の記事へスワイプ' : '次の記事へスワイプ';
  return (
    <span
      aria-label={label}
      aria-disabled={enabled ? undefined : 'true'}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-2xl transition ${
        enabled
          ? 'text-gray-800 dark:text-gray-100'
          : 'text-gray-300 dark:text-gray-700'
      }`}
    >
      {direction === 'previous' ? '←' : '→'}
    </span>
  );
}

function AdjacentItem({
  direction,
  item,
}: {
  direction: 'previous' | 'next';
  item: BlogAdjacentLink | null;
}) {
  const isPrevious = direction === 'previous';
  const label = isPrevious ? '前の記事' : '次の記事';
  const disabledLabel = `${label}はありません`;

  if (!item) {
    return (
      <span
        aria-disabled="true"
        className="block rounded-sm border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400"
      >
        {disabledLabel}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      aria-label={`${label}: ${item.title}`}
      className="group block rounded-sm border border-purple-100 bg-white/75 px-4 py-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50/80 dark:border-purple-500/30 dark:bg-gray-950/50 dark:hover:border-amber-200/40 dark:hover:bg-purple-950/30"
    >
      <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
      <span className="mt-1 block font-semibold text-gray-900 underline-offset-2 group-hover:underline dark:text-gray-50">
        {item.title}
      </span>
    </Link>
  );
}
