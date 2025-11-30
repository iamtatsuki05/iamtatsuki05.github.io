import React from 'react';
import type { LinkItem } from '@/lib/data/links';
import { SectionHeader } from './SectionHeader';
import { LinkGrid } from '@/components/links/LinkGrid';

type Props = {
  links: LinkItem[];
  ctaLabel: string;
};

export function LinksSection({ links, ctaLabel }: Props) {
  return (
    <section id="links">
      <SectionHeader title="🔗 Links" ctaLabel={ctaLabel} ctaHref="/links/" />
      <LinkGrid items={links} moreLabel={ctaLabel} iconSize={40} />
    </section>
  );
}
