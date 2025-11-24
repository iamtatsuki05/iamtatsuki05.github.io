import Link from 'next/link';
import { withBasePath, withVersion } from '@/lib/url';

type Props = {
  title: string;
  alias: string;
  handle: string;
  affiliation?: string;
  intro: string;
};

// シンプルなプロフィール表示セクション
export function ProfileSection({ title, alias, handle, affiliation, intro }: Props) {
  const avatarSrc = withVersion(withBasePath('/favicon.ico'));

  const renderAffiliation = (text: string): ReactNode => {
    const nodes: ReactNode[] = [];
    const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;
    while ((match = pattern.exec(text))) {
      const [full, label, url] = match;
      if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
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
    if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
    return nodes.length ? nodes : text;
  };

  return (
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
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alias}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{handle}</p>
        {affiliation ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{renderAffiliation(affiliation)}</p>
        ) : null}
        <p className="text-sm mt-0">
          <Link
            href="mailto:tatsukio0522@gmail.com"
            className="underline underline-offset-2 hover:no-underline"
            aria-label="Send email to tatsukio0522@gmail.com"
          >
            📧 tatsukio0522@gmail.com
          </Link>
        </p>
      </div>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white/70 dark:bg-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm sm:hidden">
        {intro}
      </p>
    </section>
  );
}
import React, { type ReactNode } from 'react';
