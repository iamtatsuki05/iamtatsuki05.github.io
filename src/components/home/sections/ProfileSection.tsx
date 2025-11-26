import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { renderInlineLinks } from '@/lib/ui/inlineMarkdown';

type Props = {
  title: string;
  alias: string;
  handle: string;
  affiliation?: string;
  intro: string;
};

const AVATAR_SRC = '/favicon.ico' as const;

// シンプルなプロフィール表示セクション
export function ProfileSection({ title, alias, handle, affiliation, intro }: Props) {

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Image
          src={AVATAR_SRC}
          alt="My Avatar"
          width={144}
          height={144}
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-gray-200 dark:border-gray-700 object-cover shadow-sm"
          priority
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alias}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{handle}</p>
          {affiliation ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{renderInlineLinks(affiliation)}</p>
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
      </div>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white/70 dark:bg-gray-900/70 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        {intro}
      </p>
    </section>
  );
}
