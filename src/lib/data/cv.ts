import type { Publication } from '@/lib/content/publication';
import type { CvData, CvDatedEntry, CvPeriodEntry, CvText } from '@/lib/data/cvLoader';
import type { Locale } from '@/lib/i18n';

export type { CvData, CvDatedEntry, CvPeriodEntry };

export function cvText(text: CvText, locale: Locale): string {
  return locale === 'ja' ? text.ja : text.en;
}

export function formatYearMonth(value: string): string {
  return value.replace('-', '.');
}

export function formatCvPeriod(entry: Pick<CvPeriodEntry, 'start' | 'end'>, presentLabel: string): string {
  const end = entry.end ? formatYearMonth(entry.end) : presentLabel;
  return entry.start ? `${formatYearMonth(entry.start)} – ${end}` : end;
}

function byNewest<T>(key: (item: T) => string) {
  return (a: T, b: T) => key(b).localeCompare(key(a));
}

// 開始年月のない項目は在籍中とみなし、先頭に並べる。
export function sortPeriodEntries(entries: CvPeriodEntry[]): CvPeriodEntry[] {
  return [...entries].sort(byNewest((e) => e.start ?? '9999-99'));
}

export function sortDatedEntries(entries: CvDatedEntry[]): CvDatedEntry[] {
  return [...entries].sort(byNewest((e) => e.date));
}

export type CvAward = {
  date: string;
  title: string;
  detail?: string;
  url?: string;
  paper?: { title: string; url?: string };
};

export function collectCvAwards(standalone: CvDatedEntry[], publications: Publication[], locale: Locale): CvAward[] {
  const fromPapers = publications.flatMap((p): CvAward[] => {
    if (!p.award) return [];
    if (!p.publishedAt) throw new Error(`Publication "${p.slug}" has an award but no publishedAt to date it`);
    return [{ date: p.publishedAt.slice(0, 7), title: p.award, paper: { title: p.title, url: p.links[0]?.url } }];
  });
  const fromCv = standalone.map(
    (entry): CvAward => ({
      date: entry.date,
      title: cvText(entry.title, locale),
      detail: entry.detail ? cvText(entry.detail, locale) : undefined,
      url: entry.url,
    }),
  );
  return [...fromPapers, ...fromCv].sort(byNewest((a) => a.date));
}

const PAPER_GROUPS = [
  { key: 'journal-international-refereed', venueType: 'journal', region: 'international', refereed: true },
  { key: 'journal-international-nonrefereed', venueType: 'journal', region: 'international', refereed: false },
  { key: 'journal-domestic-refereed', venueType: 'journal', region: 'domestic', refereed: true },
  { key: 'journal-domestic-nonrefereed', venueType: 'journal', region: 'domestic', refereed: false },
  { key: 'conference-international-refereed', venueType: 'conference', region: 'international', refereed: true },
  { key: 'conference-international-nonrefereed', venueType: 'conference', region: 'international', refereed: false },
  { key: 'conference-domestic-refereed', venueType: 'conference', region: 'domestic', refereed: true },
  { key: 'conference-domestic-nonrefereed', venueType: 'conference', region: 'domestic', refereed: false },
] as const;
export type PaperGroupKey = (typeof PAPER_GROUPS)[number]['key'];

export function groupPapersForCv(publications: Publication[]): { key: PaperGroupKey; items: Publication[] }[] {
  return PAPER_GROUPS.map((group) => ({
    key: group.key,
    items: publications.filter(
      (p) =>
        p.type === 'paper' &&
        p.venueType === group.venueType &&
        p.region === group.region &&
        p.refereed === group.refereed,
    ),
  })).filter((group) => group.items.length > 0);
}
