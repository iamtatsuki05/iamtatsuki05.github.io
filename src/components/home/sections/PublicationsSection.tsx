import { useMemo } from 'react';
import type { Publication } from '@/lib/content/publication';
import { SectionHeader } from './SectionHeader';
import { ContentCardList } from './ContentCardList';
import { SectionShell } from '@/components/home/SectionShell';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';

type Props = {
  publications: Publication[];
  locale: Locale;
  title: string;
  ctaLabel: string;
};

export function PublicationsSection({ publications, locale, title, ctaLabel }: Props) {
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
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref={localizedPath('/publications/', locale)} tone="teal" />
      <ContentCardList items={items} />
    </SectionShell>
  );
}
