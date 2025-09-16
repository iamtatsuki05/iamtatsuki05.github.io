import type { Metadata } from 'next';
import clsx from 'clsx';
import { getLinks } from '@/lib/data/links';
import { ExternalIcon } from '@/components/ui/ExternalIcon';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Links',
  description: 'A curated list of Tatsuki Okada social accounts, projects, and recommended resources.',
  locale: 'en',
  path: '/en/links/',
  languageAlternates: {
    'ja-JP': '/ja/links/',
    'en-US': '/en/links/',
    'x-default': '/links/',
  },
});

export default async function LinksEn() {
  const links = await getLinks();
  const groups = groupBy(links, (l) => l.category || 'Other');
  const mobileLimit = 3;
  const renderLinkItem = (
    key: string,
    l: (typeof links)[number],
    extraClassName?: string,
  ) => (
    <li key={key} className={clsx('card p-4 text-center', extraClassName)}>
      <a href={l.url} target="_blank" rel="noreferrer" className="inline-block mb-2">
        {l.iconUrl ? (
          <ExternalIcon src={l.iconUrl} alt={l.title} size={48} />
        ) : (
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-lg">
            {l.title.slice(0,1)}
          </span>
        )}
      </a>
      <a href={l.url} target="_blank" rel="noreferrer" className="font-medium underline-offset-2 hover:underline block">{l.title}</a>
      {l.desc ? <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{l.desc}</p> : null}
    </li>
  );
  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">🏠 Home / 🔗 Links</div>
      <h1 className="text-3xl font-bold">🔗 Links</h1>
      {Object.entries(groups).map(([cat, items]) => (
        <section key={cat} className="space-y-2">
          <h2 className="text-xl font-semibold">{cat}</h2>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((l, index) =>
              renderLinkItem(
                `${cat}-primary-${l.url}`,
                l,
                index >= mobileLimit ? 'hidden sm:block' : undefined,
              ),
            )}
          </ul>
          {items.length > mobileLimit ? (
            <details className="sm:hidden">
              <summary className="cursor-pointer text-sm underline">See more</summary>
              <ul className="grid grid-cols-2 gap-4 mt-3">
                {items.slice(mobileLimit).map((l) =>
                  renderLinkItem(`${cat}-mobile-${l.url}`, l),
                )}
              </ul>
            </details>
          ) : null}
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
