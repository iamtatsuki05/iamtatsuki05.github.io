import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { dictionaries } from '@/lib/i18n';
import { getLatestPosts } from '@/lib/content/blog';
import { getAllPublications } from '@/lib/content/publication';
import { getLinks } from '@/lib/data/links';
import { ExternalIcon } from '@/components/ui/ExternalIcon';
import { withBasePath } from '@/lib/url';
import { formatDate } from '@/lib/date';

export default async function HomeContent({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const latest = (await getLatestPosts(3)).items;
  const pubs = (await getAllPublications()).slice(0, 3);
  const links = (await getLinks()).slice(0, 6);
  return (
    <div className="space-y-10">
      <section className="flex items-center gap-4">
        <img
          src={withBasePath('/images/icon.jpeg')}
          alt="My Avatar"
          width={80}
          height={80}
          className="rounded-full border border-gray-200 dark:border-gray-700"
        />
        <div>
          <h1 className="text-3xl font-bold mb-1">{dict.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{dict.intro}</p>
          {dict.affiliation ? (
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{dict.affiliation}</p>
          ) : null}
          <p className="mt-2">
            <a
              href="mailto:tatsukio0522@gmail.com"
              className="underline underline-offset-2 hover:no-underline"
              aria-label="Send email to tatsukio0522@gmail.com"
            >
              📧 tatsukio0522@gmail.com
            </a>
          </p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">🔗 Links</h2>
          <Link href="/links/" className="text-sm underline">{dict.cta_more}</Link>
        </div>
        <ul className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {links.map((l) => (
            <li key={l.url} className="text-center">
              <a href={l.url} target="_blank" rel="noreferrer" className="inline-block">
                {l.iconUrl ? (
                  <ExternalIcon src={l.iconUrl} alt={l.title} size={40} />
                ) : (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                    {l.title.slice(0,1)}
                  </span>
                )}
              </a>
              <div className="text-xs mt-1 truncate">{l.title}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">{dict.latest_blog}</h2>
          <Link href="/blogs/" className="text-sm underline">{dict.cta_more}</Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {latest.map((p) => (
            <li key={p.slug} className="card p-4">
              <h3 className="font-medium mb-1">
                <Link href={`/blogs/${p.slug}/`} className="underline-offset-2 hover:underline">{p.title}</Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.summary}</p>
              <p className="text-xs mt-2 opacity-70">{formatDate(p.date, locale === 'ja' ? 'ja' : 'en')}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">{dict.latest_pub}</h2>
          <Link href="/publications/" className="text-sm underline">{dict.cta_more}</Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {pubs.map((p) => (
            <li key={p.slug} className="card p-4">
              <h3 className="font-medium mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.venue || p.publisher}</p>
              <p className="text-xs mt-2 opacity-70">{p.publishedAt?.slice(0, 10)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
