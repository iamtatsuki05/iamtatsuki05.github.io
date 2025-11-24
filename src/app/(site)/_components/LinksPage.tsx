import { getLinks } from '@/lib/data/links';
import type { Locale } from '@/lib/i18n';
import { linksPageCopy } from '@/app/(site)/_config/pageCopy';
import { LinkGrid } from '@/components/links/LinkGrid';

type LinkItem = Awaited<ReturnType<typeof getLinks>>[number];

export async function LinksPage({ locale }: { locale: Locale }) {
  const copy = linksPageCopy[locale];
  const links = await getLinks();
  const groups = groupBy(links, (l) => l.category || copy.groupFallback);
  const mobileLimit = 3;

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-xl font-semibold">{cat}</h2>
          <LinkGrid
            items={items}
            mobileLimit={mobileLimit}
            showDescription
            moreLabel={copy.moreLabel}
            iconSize={48}
            gridClassName="grid grid-cols-2 sm:grid-cols-3 gap-4"
          />
        </section>
      ))}
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
