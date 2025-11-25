import React from 'react';
import type { LinkItem } from '@/lib/data/links';
import { ExternalIcon } from '@/components/ui/ExternalIcon';

type Props = {
  item: LinkItem;
  size?: number;
  className?: string;
};

export function LinkIcon({ item, size = 48, className }: Props) {
  if (item.iconUrl) {
    return <ExternalIcon src={item.iconUrl} alt={item.title} size={size} className={className} />;
  }
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm ${className || ''}`}
      style={{ width: size, height: size }}
    >
      {item.title.slice(0, 1)}
    </span>
  );
}
