import React, { useCallback } from 'react';
import clsx from 'clsx';
import type { LinkItem } from '@/lib/data/links';
import { LinkIcon } from '@/components/links/LinkIcon';

type Props = {
  items: LinkItem[];
  mobileLimit?: number;
  showDescription?: boolean;
  moreLabel?: string;
  iconSize?: number;
  gridClassName?: string;
};

export function LinkGrid({ items, mobileLimit = 3, showDescription = false, moreLabel = 'See more', iconSize = 48, gridClassName = 'grid grid-cols-3 sm:grid-cols-6 gap-4' }: Props) {
  const primary = items.slice(0, mobileLimit);
  const secondary = items.slice(mobileLimit);

  const renderItem = useCallback(
    (key: string, item: LinkItem, extraClassName?: string) => (
      <li key={key} className={clsx('text-center card p-4', extraClassName)}>
        <a href={item.url} target="_blank" rel="noreferrer" className="inline-block mb-2">
          <LinkIcon item={item} size={iconSize} />
        </a>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="font-medium underline-offset-2 hover:underline block"
        >
          {item.title}
        </a>
        {showDescription && item.desc ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.desc}</p>
        ) : null}
      </li>
    ),
    [iconSize, showDescription],
  );

  return (
    <div className="space-y-3">
      <ul className={gridClassName}>
        {items.map((item, index) =>
          renderItem(
            `${item.url}-${index}`,
            item,
            index >= mobileLimit ? 'hidden sm:block' : undefined,
          ),
        )}
      </ul>

      {secondary.length ? (
        <details className="sm:hidden">
          <summary className="text-sm underline cursor-pointer">{moreLabel}</summary>
          <ul className="grid grid-cols-3 gap-4 mt-3">
            {secondary.map((item, index) => renderItem(`mobile-${item.url}-${index}`, item))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
