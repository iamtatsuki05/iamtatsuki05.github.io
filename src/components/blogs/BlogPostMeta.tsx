"use client";

import { formatDate } from '@/lib/date';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';
import type { Locale } from '@/lib/i18n';

type Props = {
  date: string;
  updated?: string;
  locale?: Locale;
};

export function BlogPostMeta({ date, updated, locale: initialLocale = 'ja' }: Props) {
  const locale = useResolvedPreferredLocale(initialLocale);
  const published = formatDate(date, locale);

  if (!updated) {
    return <p className="mt-0! text-sm opacity-70">{published}</p>;
  }

  const updatedLabel = {
    ja: '更新',
    en: 'Updated',
    zh: '更新',
    fr: 'Mis à jour',
  }[locale];
  const updatedText = locale === 'ja' || locale === 'zh'
    ? `（${updatedLabel}: ${formatDate(updated, locale)}）`
    : ` (${updatedLabel}: ${formatDate(updated, locale)})`;

  return (
    <p className="mt-0! text-sm opacity-70">
      {published}
      {updatedText}
    </p>
  );
}
