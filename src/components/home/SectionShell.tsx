import React from 'react';
import clsx from 'clsx';

const toneStyles: Record<string, string> = {
  lilac:
    'border-purple-100/70 bg-white/90 shadow-sm shadow-purple-100/60 dark:border-purple-500/30 dark:bg-[#120d21] dark:shadow-purple-900/30',
  amber:
    'border-amber-100/70 bg-white/90 shadow-sm shadow-amber-100/60 dark:border-amber-500/30 dark:bg-[#1a140a] dark:shadow-amber-900/30',
  blue:
    'border-sky-100/70 bg-white/90 shadow-sm shadow-sky-100/60 dark:border-sky-500/30 dark:bg-[#0d1624] dark:shadow-sky-900/30',
  teal:
    'border-teal-100/70 bg-white/90 shadow-sm shadow-teal-100/60 dark:border-teal-500/30 dark:bg-[#0c1a19] dark:shadow-teal-900/30',
};

type Props = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  tone?: 'lilac' | 'amber' | 'blue' | 'teal';
};

// 共通セクションの外枠（背景・枠・余白）
export function SectionShell({ children, className, tone = 'lilac', ...rest }: Props) {
  return (
    <section
      {...rest}
      className={clsx(
        'rounded-2xl',
        toneStyles[tone],
        'p-5 sm:p-6 space-y-4',
        className,
      )}
    >
      {children}
    </section>
  );
}
