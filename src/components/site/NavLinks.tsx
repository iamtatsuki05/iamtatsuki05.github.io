import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { NavDisplayItem } from '@/components/site/navItems';
import { extractLocaleFromPath, localizedPath, stripLocalePrefix } from '@/lib/routing';
import { resolveLocale } from '@/lib/i18n';

type Props = {
  items: NavDisplayItem[];
  activePath: string;
  localePrefix: string;
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
};

export function NavLinks({ items, activePath, localePrefix, orientation = 'horizontal', onNavigate }: Props) {
  const fallbackLocale = localePrefix ? resolveLocale(localePrefix.replace('/', '')) : null;
  const locale = extractLocaleFromPath(activePath) || fallbackLocale;
  const normalizedActive = stripLocalePrefix(activePath.endsWith('/') ? activePath : `${activePath}/`);
  const isActive = (href: string) => normalizedActive === (href.endsWith('/') ? href : `${href}/`);

  const baseClass = orientation === 'horizontal'
    ? 'px-2 py-1 rounded-full border border-transparent hover:border-purple-200 hover:bg-purple-50 transition-colors dark:hover:bg-[#120d21] dark:hover:border-amber-300/40'
    : 'px-3 py-2 rounded-full border border-transparent hover:border-purple-200 hover:bg-purple-50 transition-colors dark:hover:bg-[#120d21] dark:hover:border-amber-300/40';

  return (
    <nav className={clsx(orientation === 'horizontal' ? 'flex items-center gap-4' : 'flex flex-col')}>
      {items.map((n) => (
        <Link
          key={n.href}
          href={locale ? localizedPath(n.href, locale) : n.href}
          onClick={onNavigate}
          prefetch={true}
          className={clsx(
            baseClass,
            isActive(n.href) && 'border-purple-300 bg-purple-50 dark:border-amber-300/60 dark:bg-[#161028]',
          )}
        >
          {n.label}
        </Link>
      ))}
    </nav>
  );
}
