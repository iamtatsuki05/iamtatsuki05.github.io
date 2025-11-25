import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { NavDisplayItem } from '@/components/site/navItems';
import { extractLocaleFromPath, localizedPath, stripLocalePrefix } from '@/lib/routing';

type Props = {
  items: NavDisplayItem[];
  activePath: string;
  localePrefix: string;
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
};

export function NavLinks({ items, activePath, localePrefix, orientation = 'horizontal', onNavigate }: Props) {
  const locale = extractLocaleFromPath(activePath) || (localePrefix === '/en' ? 'en' : null);
  const normalizedActive = stripLocalePrefix(activePath.endsWith('/') ? activePath : `${activePath}/`);
  const isActive = (href: string) => normalizedActive === (href.endsWith('/') ? href : `${href}/`);

  const baseClass = orientation === 'horizontal'
    ? 'px-2 py-1 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800'
    : 'px-3 py-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <nav className={clsx(orientation === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col')}>
      {items.map((n) => (
        <Link
          key={n.href}
          href={locale ? localizedPath(n.href, locale) : n.href}
          onClick={onNavigate}
          className={clsx(baseClass, isActive(n.href) && 'bg-gray-100 dark:bg-gray-800')}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
