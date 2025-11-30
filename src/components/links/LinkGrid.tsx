import React, { useCallback } from 'react';
import clsx from 'clsx';
import type { LinkItem } from '@/lib/data/links';
import { LinkIcon } from '@/components/links/LinkIcon';

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
          className="font-medium underline-offset-2 hover:underline block break-words sm:break-normal sm:whitespace-nowrap sm:overflow-hidden sm:text-ellipsis"
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
        {items.map((item, index) => renderItem(`${item.url}-${index}`, item))}
      </ul>
    </div>
  );
}
