import React, { type ReactNode } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/content/blog';
import type { Publication } from '@/lib/content/publication';
import type { LinkItem } from '@/lib/data/links';
import { withBasePath, withVersion } from '@/lib/url';
import { ExternalIcon } from '@/components/ui/ExternalIcon';
import { formatDate } from '@/lib/date';

type HomeContentViewProps = {
  locale: Locale;
  dict: HomeDictionary;
  latest: BlogPost[];
  publications: Publication[];
  links: LinkItem[];
};

type HomeDictionary = {
  title: string;
  intro: string;
  alias: string;
  handle: string;
  affiliation?: string;
  latest_blog: string;
  latest_pub: string;
  cta_more: string;
};

export function HomeContentView({ locale, dict, latest, publications, links }: HomeContentViewProps) {
  const mobileLinkLimit = 3;
  const aliasLine = dict.alias;
  const handleLine = dict.handle;
  const secondaryLinks = links.slice(mobileLinkLimit);

  const renderAffiliation = (text: string): ReactNode => {
    const nodes: ReactNode[] = [];
    const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = pattern.exec(text))) {
      const [full, label, url] = match;
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      nodes.push(
        <a
          key={`affiliation-link-${key++}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:no-underline"
        >
          {label}
        </a>,
      );
      lastIndex = match.index + full.length;
    }
    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }
    return nodes.length ? nodes : text;
  };

  const renderLinkItem = (
    key: string,
    item: LinkItem,
    className?: string,
  ) => (
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

  const avatarSrc = withVersion(withBasePath('/favicon.ico'));

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={avatarSrc}
          alt="My Avatar"
          width={144}
          height={144}
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-gray-200 dark:border-gray-700 object-cover shadow-sm"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{dict.title}</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{aliasLine}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{handleLine}</p>
          {dict.affiliation ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{renderAffiliation(dict.affiliation)}</p>
          ) : null}
          <p className="text-sm mt-0">
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
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white/70 dark:bg-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          {dict.intro}
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">🔗 Links</h2>
          <Link href="/links/" className="text-sm underline">{dict.cta_more}</Link>
        </div>
        <ul className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {links.map((link, index) =>
            renderLinkItem(
              `primary-${link.url}`,
              link,
              index >= mobileLinkLimit ? 'hidden sm:block' : undefined,
            ),
          )}
        </ul>
        {secondaryLinks.length ? (
          <details className="sm:hidden mt-4">
            <summary className="text-sm underline cursor-pointer">{dict.cta_more}</summary>
            <ul className="grid grid-cols-3 gap-4 mt-3">
              {secondaryLinks.map((link) => renderLinkItem(`mobile-${link.url}`, link))}
            </ul>
          </details>
        ) : null}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-semibold">{dict.latest_blog}</h2>
          <Link href="/blogs/" className="text-sm underline">{dict.cta_more}</Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2" data-testid="home-latest-blog-list">
          {latest.map((post) => (
            <li key={post.slug} className="card p-4" data-testid="home-latest-blog-card">
              <h3 className="font-medium mb-1">
                <Link
                  href={`/blogs/${post.slug}/`}
                  className="underline-offset-2 hover:underline"
                  data-testid="home-latest-blog-link"
                >
                  {post.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.summary}</p>
              <p className="text-xs mt-2 opacity-70">{formatDate(post.date, locale === 'ja' ? 'ja' : 'en')}</p>
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
          {publications.map((pub) => (
            <li key={pub.slug} className="h-full">
              {pub.links?.[0]?.url ? (
                <a
                  href={pub.links[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="card flex h-full flex-col p-4 hover:border-gray-300 dark:hover:border-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                >
                  <h3 className="font-medium mb-1">{pub.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-1">{pub.venue || pub.publisher}</p>
                  <p className="text-xs mt-2 opacity-70">{pub.publishedAt?.slice(0, 10)}</p>
                </a>
              ) : (
                <div className="card flex h-full flex-col p-4">
                  <h3 className="font-medium mb-1">{pub.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 flex-1">{pub.venue || pub.publisher}</p>
                  <p className="text-xs mt-2 opacity-70">{pub.publishedAt?.slice(0, 10)}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
