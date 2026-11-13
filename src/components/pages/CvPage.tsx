import type { ComponentProps } from 'react';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { PublicationCard } from '@/components/publications/PublicationCard';
import type { Publication } from '@/lib/content/publication';
import {
  type CvData,
  type CvDatedEntry,
  type CvPeriodEntry,
  cvText,
  formatCvPeriod,
  formatYearMonth,
  groupPapersForCv,
  sortDatedEntries,
  sortPeriodEntries,
} from '@/lib/data/cv';
import type { Locale } from '@/lib/i18n';
import { cvPageCopy } from '@/lib/pageCopy';
import { renderInlineLinks } from '@/lib/ui/inlineMarkdown';

type Props = {
  locale: Locale;
  cv: CvData;
  publications: Publication[];
  alias: string;
  affiliation: string;
};

type Tone = ComponentProps<typeof SectionShell>['tone'];

function EntryCard({ when, entry, locale }: { when: string; entry: CvPeriodEntry | CvDatedEntry; locale: Locale }) {
  const title = cvText(entry.title, locale);
  return (
    <li className="card p-3 gap-4 sm:flex" data-testid="cv-entry">
      <p className="shrink-0 text-sm tabular-nums text-gray-600 sm:w-40 dark:text-gray-300">{when}</p>
      <div className="min-w-0">
        <h3 className="text-base font-semibold">
          {entry.url ? (
            <a href={entry.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {entry.detail ? <p className="text-sm text-gray-700 dark:text-gray-300">{cvText(entry.detail, locale)}</p> : null}
      </div>
    </li>
  );
}

function PeriodSection({ title, tone, entries, locale, present }: { title: string; tone: Tone; entries: CvPeriodEntry[]; locale: Locale; present: string }) {
  if (!entries.length) return null;
  return (
    <SectionShell tone={tone}>
      <SectionHeader title={title} tone={tone} />
      <ul className="space-y-3">
        {sortPeriodEntries(entries).map((entry) => (
          <EntryCard key={`${entry.start}-${entry.title.en}`} when={formatCvPeriod(entry, present)} entry={entry} locale={locale} />
        ))}
      </ul>
    </SectionShell>
  );
}

export function CvPage({ locale, cv, publications, alias, affiliation }: Props) {
  const copy = cvPageCopy[locale];
  const papers = groupPapersForCv(publications);

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>

      <SectionShell>
        <p className="text-sm text-gray-700 dark:text-gray-300">{alias}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{renderInlineLinks(affiliation)}</p>
      </SectionShell>

      <PeriodSection title={copy.sections.education} tone="blue" entries={cv.education} locale={locale} present={copy.present} />
      <PeriodSection title={copy.sections.experience} tone="amber" entries={cv.experience} locale={locale} present={copy.present} />

      {papers.length ? (
        <SectionShell tone="lilac">
          <SectionHeader title={copy.sections.publications} tone="lilac" />
          {papers.map((group) => (
            <div key={group.key} className="space-y-3" data-testid={`cv-papers-${group.key}`}>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{copy.paperGroups[group.key]}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <PublicationCard key={item.slug} item={item} titleAs="h4" />
                ))}
              </ul>
            </div>
          ))}
        </SectionShell>
      ) : null}

      <PeriodSection title={copy.sections.grants} tone="teal" entries={cv.grants} locale={locale} present={copy.present} />

      {cv.awards.length ? (
        <SectionShell tone="amber">
          <SectionHeader title={copy.sections.awards} tone="amber" />
          <ul className="space-y-3">
            {sortDatedEntries(cv.awards).map((entry) => (
              <EntryCard key={`${entry.date}-${entry.title.en}`} when={formatYearMonth(entry.date)} entry={entry} locale={locale} />
            ))}
          </ul>
        </SectionShell>
      ) : null}
    </div>
  );
}
