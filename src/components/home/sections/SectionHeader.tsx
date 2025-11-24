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
};

export function SectionHeader({ title, subtitle, ctaLabel, ctaHref, actions, className }: Props) {
  return (
    <div className={clsx('flex items-center justify-between gap-2 mb-3', className)}>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3 text-sm">
        {actions}
        {ctaLabel && ctaHref ? (
          <Link href={ctaHref} className="underline whitespace-nowrap">
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
