import { getLinks } from '@/lib/data/links';
import type { Locale } from '@/lib/i18n';
import { linksPageCopy } from '@/app/(site)/_config/pageCopy';
import { LinkGrid } from '@/components/links/LinkGrid';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';

type LinkItem = Awaited<ReturnType<typeof getLinks>>[number];

export async function LinksPage({ locale }: { locale: Locale }) {
  const copy = linksPageCopy[locale];
  const links = await getLinks();
  const groups = groupBy(links, (l) => l.category || copy.groupFallback);
  const tones: Array<'blue' | 'lilac' | 'amber' | 'teal'> = ['blue', 'lilac', 'amber', 'teal'];

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      {Object.entries(groups).map(([cat, items], idx) => {
        const tone = tones[idx % tones.length] as 'blue' | 'lilac' | 'amber' | 'teal';
        return (
          <SectionShell key={cat} tone={tone}>
            <SectionHeader title={cat} tone={tone} />
            <LinkGrid
              items={items}
              showDescription
              iconSize={48}
              gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            />
          </SectionShell>
        );
      })}
    </div>
  );
}

function groupBy<T, K extends string | number>(arr: T[], key: (x: T) => K): Record<K, T[]> {
  return arr.reduce((acc, cur) => {
    const k = key(cur);
    (acc[k] ||= []).push(cur);
    return acc;
  }, {} as Record<K, T[]>);
}
