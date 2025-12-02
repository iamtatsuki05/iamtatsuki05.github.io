import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

type Props = {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  actions?: React.ReactNode;
  className?: string;
  tone?: 'lilac' | 'amber' | 'blue' | 'teal';
};

const toneMap: Record<'lilac' | 'amber' | 'blue' | 'teal', { badge: string; cta: string }> = {
  lilac: {
    badge: 'border-purple-100/70 bg-purple-50/70 text-purple-700 dark:border-purple-500/40 dark:bg-[#1a1230] dark:text-purple-100',
    cta: 'border-purple-200/70 bg-white text-gray-900 shadow-purple-100 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30',
  },
  amber: {
    badge: 'border-amber-100/70 bg-amber-50/70 text-amber-700 dark:border-amber-500/40 dark:bg-[#26180c] dark:text-amber-100',
    cta: 'border-amber-200/70 bg-white text-gray-900 shadow-amber-100 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-amber-50 dark:shadow-amber-900/30',
  },
  blue: {
    badge: 'border-sky-100/70 bg-sky-50/70 text-sky-700 dark:border-sky-500/40 dark:bg-[#0f1a28] dark:text-sky-100',
    cta: 'border-sky-200/70 bg-white text-gray-900 shadow-sky-100 dark:border-sky-400/40 dark:bg-[#0f172a] dark:text-sky-50 dark:shadow-sky-900/30',
  },
  teal: {
    badge: 'border-teal-100/70 bg-teal-50/70 text-teal-700 dark:border-teal-500/40 dark:bg-[#0f1f1c] dark:text-teal-100',
    cta: 'border-teal-200/70 bg-white text-gray-900 shadow-teal-100 dark:border-teal-400/40 dark:bg-[#0f172a] dark:text-teal-50 dark:shadow-teal-900/30',
  },
};

export function SectionHeader({ title, subtitle, ctaLabel, ctaHref, actions, className, tone = 'lilac' }: Props) {
  return (
    <div className={clsx('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-1', className)}>
      <div className="space-y-1">
        <h2 className="sr-only">{title}</h2>
        <div className={clsx(
          'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm',
          toneMap[tone].badge,
        )}>
          {title}
        </div>
        {subtitle ? <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3 text-sm sm:self-end">
        {actions}
        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            prefetch={true}
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm transition hover:-translate-y-0.5 hover:shadow-md',
              toneMap[tone].cta,
              'shadow-sm',
            )}
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
