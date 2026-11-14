import type { ComponentProps, ReactNode } from 'react';
import { SectionShell } from '@/components/home/SectionShell';
import { SectionHeader } from '@/components/home/sections/SectionHeader';
import { PublicationCard } from '@/components/publications/PublicationCard';
import type { Publication } from '@/lib/content/publication';
import {
  type CvAward,
  type CvData,
  type CvPeriodEntry,
  collectCvAwards,
  cvText,
  formatCvPeriod,
  formatYearMonth,
  groupPapersForCv,
  sortPeriodEntries,
} from '@/lib/data/cv';
import type { Locale } from '@/lib/i18n';
import { cvPageCopy } from '@/lib/pageCopy';
import { siteConfig } from '@/lib/seo/config';
import { renderInlineLinks } from '@/lib/ui/inlineMarkdown';

type Props = {
  locale: Locale;
  cv: CvData;
  publications: Publication[];
  alias: string;
  affiliation: string;
};

type Tone = ComponentProps<typeof SectionShell>['tone'];

function TitleLink({ title, url }: { title: string; url?: string }) {
  return url ? (
    <a href={url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
      {title}
    </a>
  ) : (
    title
  );
}

function EntryCard({ when, title, url, children }: { when: string; title: string; url?: string; children?: ReactNode }) {
  return (
    <li className="card p-3 gap-4 sm:flex" data-testid="cv-entry">
      <p className="shrink-0 text-sm tabular-nums text-gray-600 sm:w-40 dark:text-gray-300">{when}</p>
      <div className="min-w-0">
        <h3 className="text-base font-semibold">
          <TitleLink title={title} url={url} />
        </h3>
        {children}
      </div>
    </li>
  );
}

function Detail({ children }: { children: ReactNode }) {
  return <p className="text-sm text-gray-700 dark:text-gray-300">{children}</p>;
}

function AwardCard({ award, paperLabel }: { award: CvAward; paperLabel: string }) {
  return (
    <EntryCard when={formatYearMonth(award.date)} title={award.title} url={award.url}>
      {award.detail ? <Detail>{award.detail}</Detail> : null}
      {award.paper ? (
        <Detail>
          {paperLabel}: <TitleLink title={award.paper.title} url={award.paper.url} />
        </Detail>
      ) : null}
    </EntryCard>
  );
}

function PeriodSection({ title, tone, entries, locale, present }: { title: string; tone: Tone; entries: CvPeriodEntry[]; locale: Locale; present: string }) {
  if (!entries.length) return null;
  return (
    <SectionShell tone={tone}>
      <SectionHeader title={title} tone={tone} />
      <ul className="space-y-3">
        {sortPeriodEntries(entries).map((entry) => (
          <EntryCard key={entry.title.en} when={formatCvPeriod(entry, present)} title={cvText(entry.title, locale)} url={entry.url}>
            {entry.detail ? <Detail>{cvText(entry.detail, locale)}</Detail> : null}
          </EntryCard>
        ))}
      </ul>
    </SectionShell>
  );
}

export function CvPage({ locale, cv, publications, alias, affiliation }: Props) {
  const copy = cvPageCopy[locale];
  const papers = groupPapersForCv(publications);
  const talks = publications.filter((p) => p.type === 'talk');
  const awards = collectCvAwards(cv.awards, publications, locale);

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>

      <SectionShell>
        <p className="text-sm text-gray-700 dark:text-gray-300">{alias}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{renderInlineLinks(affiliation)}</p>
      </SectionShell>

      <PeriodSection title={copy.sections.education} tone="blue" entries={cv.education} locale={locale} present={copy.present} />

      <SectionShell tone="amber">
        <SectionHeader title={copy.sections.experience} tone="amber" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {copy.experienceLinkLead}{' '}
          <a href={siteConfig.socials.linkedin} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
            LinkedIn
          </a>
        </p>
      </SectionShell>

      {papers.length ? (
        <SectionShell tone="lilac">
          <SectionHeader title={copy.sections.publications} tone="lilac" />
          {papers.map((group) => (
            <div key={group.key} className="space-y-3" data-testid={`cv-papers-${group.key}`}>
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{copy.paperGroups[group.key]}</h3>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <PublicationCard key={item.slug} item={item} locale={locale} titleAs="h4" />
                ))}
              </ul>
            </div>
          ))}
        </SectionShell>
      ) : null}

      {talks.length ? (
        <SectionShell tone="blue">
          <SectionHeader title={copy.sections.talks} tone="blue" />
          <ul className="space-y-3">
            {talks.map((item) => (
              <PublicationCard key={item.slug} item={item} locale={locale} titleAs="h3" />
            ))}
          </ul>
        </SectionShell>
      ) : null}

      <PeriodSection title={copy.sections.grants} tone="teal" entries={cv.grants} locale={locale} present={copy.present} />

      {awards.length ? (
        <SectionShell tone="amber">
          <SectionHeader title={copy.sections.awards} tone="amber" />
          <ul className="space-y-3">
            {awards.map((award) => (
              <AwardCard key={`${award.date}-${award.title}-${award.paper?.title ?? ''}`} award={award} paperLabel={copy.awardPaperLabel} />
            ))}
          </ul>
        </SectionShell>
      ) : null}
    </div>
  );
}
