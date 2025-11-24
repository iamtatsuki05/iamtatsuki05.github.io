import React from 'react';
import clsx from 'clsx';
import type { LinkItem } from '@/lib/data/links';
import { ExternalIcon } from '@/components/ui/ExternalIcon';
import { SectionHeader } from './SectionHeader';

type Props = {
  links: LinkItem[];
  ctaLabel: string;
};

const MOBILE_PRIMARY = 3;

export function LinksSection({ links, ctaLabel }: Props) {
  const secondaryLinks = links.slice(MOBILE_PRIMARY);

  const renderLinkItem = (key: string, item: LinkItem, className?: string) => (
    <li key={key} className={clsx('text-center', className)}>
      <a href={item.url} target="_blank" rel="noreferrer" className="inline-block">
        {item.iconUrl ? (
          <ExternalIcon src={item.iconUrl} alt={item.title} size={40} />
        ) : (
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
            {item.title.slice(0, 1)}
          </span>
        )}
      </a>
      <div className="text-xs mt-1 truncate">{item.title}</div>
    </li>
  );

  return (
    <section>
      <SectionHeader title="🔗 Links" ctaLabel={ctaLabel} ctaHref="/links/" />
      <ul className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {links.map((link, index) =>
          renderLinkItem(
            `primary-${link.url}`,
            link,
            index >= MOBILE_PRIMARY ? 'hidden sm:block' : undefined,
          ),
        )}
      </ul>
      {secondaryLinks.length ? (
        <details className="sm:hidden mt-4">
          <summary className="text-sm underline cursor-pointer">{ctaLabel}</summary>
          <ul className="grid grid-cols-3 gap-4 mt-3">
            {secondaryLinks.map((link) => renderLinkItem(`mobile-${link.url}`, link))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}
