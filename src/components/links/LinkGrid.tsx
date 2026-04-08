"use client";

import React, { useCallback } from 'react';
import clsx from 'clsx';
import type { LinkItem } from '@/lib/data/links';
import { LinkIcon } from '@/components/links/LinkIcon';
import { useInitialReveal } from '@/hooks/useInitialReveal';

type Props = {
  items: LinkItem[];
  showDescription?: boolean;
  iconSize?: number;
  gridClassName?: string;
};

export function LinkGrid({
  items,
  showDescription = false,
  iconSize = 48,
  gridClassName = 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4',
}: Props) {
  const isVisible = useInitialReveal(52);
  const renderItem = useCallback(
    (key: string, item: LinkItem, index: number, extraClassName?: string) => (
      <li
        key={key}
        className={clsx('content-reveal-card content-reveal-card--soft text-center card p-4', extraClassName)}
        style={isVisible ? { transitionDelay: `${90 + index * 26}ms` } : undefined}
      >
        <a href={item.url} target="_blank" rel="noreferrer" className="link-grid__icon-link inline-block mb-2">
          <LinkIcon item={item} size={iconSize} />
        </a>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="link-grid__title font-medium block break-words sm:break-normal sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
        >
          {item.title}
        </a>
        {showDescription && item.desc ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.desc}</p>
        ) : null}
      </li>
    ),
    [iconSize, isVisible, showDescription],
  );

  return (
    <div className="space-y-3">
      <ul className={clsx('content-reveal-list', gridClassName)} data-state={isVisible ? 'open' : 'hidden'}>
        {items.map((item, index) => renderItem(`${item.url}-${index}`, item, index))}
      </ul>
    </div>
  );
}
