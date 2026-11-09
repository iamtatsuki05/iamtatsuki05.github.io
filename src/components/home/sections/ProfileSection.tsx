import Link from '@/components/compat/Link';
import Image from '@/components/compat/Image';
import { withBasePath } from '@/lib/url';
import { renderInlineLinks } from '@/lib/ui/inlineMarkdown';
import { SectionShell } from '@/components/home/SectionShell';

type Props = {
  title: string;
  alias: string;
  handle: string;
  affiliation?: string;
  intro: string;
};

const AVATAR_SRC = '/avatar-144.webp' as const;
const AVATAR_SRC_2X = '/avatar-288.webp' as const;

export function ProfileSection({ title, alias, handle, affiliation, intro }: Props) {
  return (
    <SectionShell>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex justify-center">
          <Image
            src={AVATAR_SRC}
            srcSet={`${withBasePath(AVATAR_SRC)} 1x, ${withBasePath(AVATAR_SRC_2X)} 2x`}
            alt=""
            width={144}
            height={144}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-white dark:border-purple-500/40 object-cover shadow-[0_18px_36px_-24px_rgba(168,85,247,0.35)] dark:shadow-purple-900/40"
            priority
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2 text-purple-800 dark:text-purple-200">
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
            >
              <span aria-hidden="true">📧</span> tatsukio0522@gmail.com
            </Link>
          </p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed bg-white/92 dark:bg-gray-900/70 rounded-lg border border-purple-200/80 dark:border-purple-500/40 p-4 shadow-[0_18px_34px_-28px_rgba(168,85,247,0.24)]">
        {intro}
      </p>
    </SectionShell>
  );
}
