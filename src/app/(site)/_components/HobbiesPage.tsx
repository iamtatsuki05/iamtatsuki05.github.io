import Link from 'next/link';
import Image from 'next/image';
import { hobbiesPageCopy } from '@/app/(site)/_config/pageCopy';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { getAllPosts } from '@/lib/content/blog';
import { resolveHobbies } from '@/lib/data/hobbies';
import type { Locale } from '@/lib/i18n';

const toneClassNames = {
  lilac: 'border-purple-200/70 bg-purple-50/70 text-purple-700 dark:border-purple-400/40 dark:bg-purple-500/10 dark:text-purple-100',
  amber: 'border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-300/40 dark:bg-amber-500/10 dark:text-amber-100',
  blue: 'border-sky-200/80 bg-sky-50/80 text-sky-700 dark:border-sky-300/40 dark:bg-sky-500/10 dark:text-sky-100',
  teal: 'border-teal-200/80 bg-teal-50/80 text-teal-700 dark:border-teal-300/40 dark:bg-teal-500/10 dark:text-teal-100',
} as const;

export async function HobbiesPage({ locale }: { locale: Locale }) {
  const copy = hobbiesPageCopy[locale];
  const posts = await getAllPosts();
  const hobbies = resolveHobbies(locale, posts);

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>

      <SectionShell tone="amber">
        <SectionHeader title={copy.introHeading} tone="amber" />
        <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">
          {copy.introBody}
        </p>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby) => (
            <span
              key={hobby.id}
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${toneClassNames[hobby.tone]}`}
            >
              <span aria-hidden="true">{hobby.emoji}</span>
              <span>{hobby.title}</span>
            </span>
          ))}
        </div>
      </SectionShell>

      <SectionShell tone="blue">
        <SectionHeader title={copy.gridHeading} tone="blue" />
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hobbies.map((hobby, index) => (
            <li key={hobby.id}>
              <Link
                href={hobby.href}
                className="card pressable-card group flex h-full flex-col overflow-hidden p-0"
                data-testid="hobby-card"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                  <Image
                    src={hobby.thumbnailSrc}
                    alt={hobby.thumbnailAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    loading={index < 2 ? 'eager' : 'lazy'}
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                    <span aria-hidden="true">{hobby.emoji}</span>
                    <span>{hobby.title}</span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className={`rounded-2xl border px-3 py-3 text-sm leading-6 ${toneClassNames[hobby.tone]}`}>
                    <p className="text-xs font-semibold tracking-[0.12em] uppercase opacity-80">{copy.currentFocusLabel}</p>
                    <p className="mt-1">{hobby.currentFocus}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      {formatRelatedLabel(locale, hobby.relatedCount, copy)}
                    </span>
                    <span className="font-medium text-purple-700 transition group-hover:translate-x-0.5 dark:text-amber-200">
                      {copy.ctaLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </SectionShell>
    </div>
  );
}

function formatRelatedLabel(
  locale: Locale,
  count: number,
  copy: (typeof hobbiesPageCopy)[Locale],
) {
  if (count <= 0) return copy.emptyStateLabel;
  return locale === 'ja' ? `関連するBlog記事 ${count}件` : `${count} related blog posts`;
}
