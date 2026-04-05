"use client";

import React from 'react';
import { formatDate } from '@/lib/date';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';

type Props = {
  date: string;
  updated?: string;
};

export function BlogPostMeta({ date, updated }: Props) {
  const locale = useResolvedPreferredLocale();
  const published = formatDate(date, locale);

  if (!updated) {
    return <p className="mt-0! text-sm opacity-70">{published}</p>;
  }

  const updatedText =
    locale === 'ja'
      ? `（更新: ${formatDate(updated, locale)}）`
      : ` (Updated: ${formatDate(updated, locale)})`;

  return (
    <p className="mt-0! text-sm opacity-70">
      {published}
      {updatedText}
    </p>
  );
}
