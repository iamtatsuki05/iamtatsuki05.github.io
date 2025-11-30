import React from 'react';
import type { LinkItem } from '@/lib/data/links';
import { SectionHeader } from './SectionHeader';
import { LinkGrid } from '@/components/links/LinkGrid';
import { SectionShell } from '@/components/home/SectionShell';

type Props = {
  links: LinkItem[];
  ctaLabel: string;
};

export function LinksSection({ links, ctaLabel }: Props) {
  return (
    <SectionShell id="links" tone="blue">
      <SectionHeader title="🔗 Links" ctaLabel={ctaLabel} ctaHref="/links/" tone="blue" />
      <LinkGrid items={links} iconSize={44} />
    </SectionShell>
  );
}
