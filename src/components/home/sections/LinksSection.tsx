
import type { LinkItem } from '@/lib/data/links';
import { SectionHeader } from './SectionHeader';
import { LinkGrid } from '@/components/links/LinkGrid';
import { SectionShell } from '@/components/home/SectionShell';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';

type Props = {
  links: LinkItem[];
  locale: Locale;
  title: string;
  ctaLabel: string;
};

export function LinksSection({ links, locale, title, ctaLabel }: Props) {
  return (
    <SectionShell id="links" tone="blue">
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref={localizedPath('/links/', locale)} tone="blue" />
      <LinkGrid items={links} iconSize={44} />
    </SectionShell>
  );
}
