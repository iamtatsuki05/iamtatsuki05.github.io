import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';
import type { Publication } from '@/lib/content/publication';
import type { Locale } from '@/lib/i18n';
import { cached } from '@/lib/server/cache';

const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');
// CV の各項目は日本語と英語だけを書く。zh と fr の読者には、CV の慣習どおり英語で見せる。
const CvText = z.object({ ja: z.string(), en: z.string() });

const PeriodEntry = z.object({
  start: YearMonth,
  end: YearMonth.optional(),
  title: CvText,
  detail: CvText.optional(),
  url: z.url().optional(),
});

const DatedEntry = z.object({
  date: YearMonth,
  title: CvText,
  detail: CvText.optional(),
  url: z.url().optional(),
});

export const CvData = z.object({
  education: z.array(PeriodEntry).default([]),
  experience: z.array(PeriodEntry).default([]),
  grants: z.array(PeriodEntry).default([]),
  awards: z.array(DatedEntry).default([]),
});
export type CvData = z.infer<typeof CvData>;
type CvText = z.infer<typeof CvText>;
export type CvPeriodEntry = z.infer<typeof PeriodEntry>;
export type CvDatedEntry = z.infer<typeof DatedEntry>;

const CV_FILE = path.join(process.cwd(), 'src', 'data', 'cv.yaml');

export function parseCvData(raw: string, filePath = CV_FILE): CvData {
  const result = CvData.safeParse(YAML.parse(raw) ?? {});
  if (!result.success) {
    throw new Error(`Invalid CV data in ${filePath}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export async function getCvData(): Promise<CvData> {
  return cached('cv:data', async () => parseCvData(await fs.readFile(CV_FILE, 'utf8')));
}

export function cvText(text: CvText, locale: Locale): string {
  return locale === 'ja' ? text.ja : text.en;
}

export function formatYearMonth(value: string): string {
  return value.replace('-', '.');
}

export function formatCvPeriod(entry: Pick<CvPeriodEntry, 'start' | 'end'>, presentLabel: string): string {
  return `${formatYearMonth(entry.start)} – ${entry.end ? formatYearMonth(entry.end) : presentLabel}`;
}

function byNewest<T>(key: (item: T) => string) {
  return (a: T, b: T) => key(b).localeCompare(key(a));
}

export function sortPeriodEntries(entries: CvPeriodEntry[]): CvPeriodEntry[] {
  return [...entries].sort(byNewest((e) => e.start));
}

export function sortDatedEntries(entries: CvDatedEntry[]): CvDatedEntry[] {
  return [...entries].sort(byNewest((e) => e.date));
}

const PAPER_GROUPS = [
  { key: 'international-refereed', region: 'international', refereed: true },
  { key: 'international-nonrefereed', region: 'international', refereed: false },
  { key: 'domestic-refereed', region: 'domestic', refereed: true },
  { key: 'domestic-nonrefereed', region: 'domestic', refereed: false },
] as const;
export type PaperGroupKey = (typeof PAPER_GROUPS)[number]['key'];

export function groupPapersForCv(publications: Publication[]): { key: PaperGroupKey; items: Publication[] }[] {
  return PAPER_GROUPS.map((group) => ({
    key: group.key,
    items: publications.filter(
      (p) => p.type === 'paper' && p.region === group.region && p.refereed === group.refereed,
    ),
  })).filter((group) => group.items.length > 0);
}
