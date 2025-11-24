import React from 'react';
import clsx from 'clsx';

type Props = {
  as?: 'div' | 'a';
  href?: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  testId?: string;
};

export function Card({ as = 'div', href, children, className, target, rel, testId }: Props) {
  const base = 'card p-4 h-full flex flex-col';
  if (as === 'a' && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={clsx(base, className)}
        data-testid={testId}
      >
        {children}
      </a>
    );
  }
  return (
    <div className={clsx(base, className)} data-testid={testId}>
      {children}
    </div>
  );
}

