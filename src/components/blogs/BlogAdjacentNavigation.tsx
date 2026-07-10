"use client";

import Link from '@/components/compat/Link';
import { useRouter } from '@/lib/compat/navigation';
import { useRef } from 'react';
import type { Locale } from '@/lib/i18n';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';

export type BlogAdjacentLink = {
  title: string;
  href: string;
};

export function BlogAdjacentNavigation({
  previous,
  next,
  locale: initialLocale = 'ja',
}: {
  previous: BlogAdjacentLink | null;
  next: BlogAdjacentLink | null;
  locale?: Locale;
}) {
  const router = useRouter();
  const locale = useResolvedPreferredLocale(initialLocale);
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
        <SwipeArrow direction="previous" enabled={Boolean(previous)} locale={locale} />
        <span className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
        <SwipeArrow direction="next" enabled={Boolean(next)} locale={locale} />
      </div>
      <div data-testid="blog-adjacent-desktop-links" className="hidden gap-3 sm:grid sm:grid-cols-2">
        <AdjacentItem direction="previous" item={previous} locale={locale} />
        <AdjacentItem direction="next" item={next} locale={locale} />
      </div>
    </nav>
  );
}

function SwipeArrow({
  direction,
  enabled,
  locale,
}: {
  direction: 'previous' | 'next';
  enabled: boolean;
  locale: Locale;
}) {
  const label = adjacentCopy[locale][direction === 'previous' ? 'swipePrevious' : 'swipeNext'];
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-2xl transition ${
        enabled
          ? 'text-gray-800 dark:text-gray-100'
          : 'text-gray-300 dark:text-gray-700'
      }`}
    >
      <span aria-hidden="true">{direction === 'previous' ? '←' : '→'}</span>
      {enabled ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}

function AdjacentItem({
  direction,
  item,
  locale,
}: {
  direction: 'previous' | 'next';
  item: BlogAdjacentLink | null;
  locale: Locale;
}) {
  const isPrevious = direction === 'previous';
  const copy = adjacentCopy[locale];
  const label = isPrevious ? copy.previous : copy.next;
  const disabledLabel = isPrevious ? copy.noPrevious : copy.noNext;

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

const adjacentCopy: Record<
  Locale,
  {
    previous: string;
    next: string;
    noPrevious: string;
    noNext: string;
    swipePrevious: string;
    swipeNext: string;
  }
> = {
  ja: {
    previous: '前の記事',
    next: '次の記事',
    noPrevious: '前の記事はありません',
    noNext: '次の記事はありません',
    swipePrevious: '前の記事へスワイプ',
    swipeNext: '次の記事へスワイプ',
  },
  en: {
    previous: 'Previous post',
    next: 'Next post',
    noPrevious: 'No previous post',
    noNext: 'No next post',
    swipePrevious: 'Swipe to previous post',
    swipeNext: 'Swipe to next post',
  },
  zh: {
    previous: '上一篇',
    next: '下一篇',
    noPrevious: '没有上一篇',
    noNext: '没有下一篇',
    swipePrevious: '滑动到上一篇',
    swipeNext: '滑动到下一篇',
  },
  fr: {
    previous: 'Article précédent',
    next: 'Article suivant',
    noPrevious: 'Aucun article précédent',
    noNext: 'Aucun article suivant',
    swipePrevious: 'Glisser vers l’article précédent',
    swipeNext: 'Glisser vers l article suivant',
  },
};
