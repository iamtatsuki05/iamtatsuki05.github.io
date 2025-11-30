import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { renderInlineLinks } from '@/lib/ui/inlineMarkdown';
import { SectionShell } from '@/components/home/SectionShell';

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
    <SectionShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Image
          src={AVATAR_SRC}
          alt="My Avatar"
          width={144}
          height={144}
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-purple-100 dark:border-purple-500/40 object-cover shadow-sm shadow-purple-100/60 dark:shadow-purple-900/40"
          priority
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-500 via-amber-300 to-purple-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{alias}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{handle}</p>
          {affiliation ? (
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0">{renderInlineLinks(affiliation)}</p>
          ) : null}
          <p className="text-sm mt-0">
            <Link
              href="mailto:tatsukio0522@gmail.com"
              className="inline-flex items-center gap-1 rounded-full border border-purple-200/60 px-3 py-1 text-purple-700 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 dark:border-amber-300/40 dark:text-purple-50 dark:shadow-amber-900/30"
              aria-label="Send email to tatsukio0522@gmail.com"
            >
              📧 tatsukio0522@gmail.com
            </Link>
          </p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white/80 dark:bg-gray-900/70 rounded-lg border border-purple-100/70 dark:border-purple-500/40 p-4 shadow-sm">
        {intro}
      </p>
    </SectionShell>
  );
}
