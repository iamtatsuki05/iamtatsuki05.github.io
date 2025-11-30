import React, { useMemo } from 'react';
import type { Publication } from '@/lib/content/publication';
import { SectionHeader } from './SectionHeader';
import { ContentCardList } from './ContentCardList';
import { SectionShell } from '@/components/home/SectionShell';

type Props = {
  publications: Publication[];
  title: string;
  ctaLabel: string;
};

export function PublicationsSection({ publications, title, ctaLabel }: Props) {
  const items = useMemo(
    () =>
      publications.map((pub) => {
        const firstLink = pub.links?.[0]?.url;
        return {
          key: pub.slug,
          title: pub.title,
          description: pub.venue || pub.publisher,
          href: firstLink,
          external: Boolean(firstLink),
          date: pub.publishedAt?.slice(0, 10),
        };
      }),
    [publications],
  );

  return (
    <SectionShell id="publications" tone="teal">
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref="/publications/" tone="teal" />
      <ContentCardList items={items} />
    </SectionShell>
  );
}
