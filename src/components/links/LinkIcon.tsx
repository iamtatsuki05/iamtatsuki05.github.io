import React from 'react';
import clsx from 'clsx';
import type { LinkItem } from '@/lib/data/links';
import { ExternalIcon } from '@/components/ui/ExternalIcon';

type Props = {
  item: LinkItem;
  size?: number;
  className?: string;
};

export function LinkIcon({ item, size = 48, className }: Props) {
  const wrapperSize = size + 20;
  const wrapperClass = clsx(
    'inline-flex items-center justify-center rounded-full border bg-white shadow-sm shadow-purple-100/60 overflow-hidden',
    'dark:border-purple-500/30 dark:bg-[#110c1a] dark:shadow-purple-900/40',
    className,
  );

  if (item.iconUrl) {
    return (
      <span className={wrapperClass} style={{ width: wrapperSize, height: wrapperSize }}>
        <ExternalIcon
          src={item.iconUrl}
          alt={item.title}
          size={size}
          className="block max-h-[72%] max-w-[72%] object-contain"
        />
      </span>
    );
  }
  return (
    <span className={wrapperClass} style={{ width: wrapperSize, height: wrapperSize }}>
      <span
        className="inline-flex items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-800/60 dark:text-purple-100"
        style={{ width: Math.max(size * 0.72, 26), height: Math.max(size * 0.72, 26) }}
      >
        {item.title.slice(0, 1)}
      </span>
    </span>
  );
}
