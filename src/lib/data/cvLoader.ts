import fs from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'zod';
import { cached } from '@/lib/server/cache';

const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');
// CV の各項目は日本語と英語だけを書く。zh と fr の読者には、CV の慣習どおり英語で見せる。
const CvText = z.object({ ja: z.string(), en: z.string() });

const PeriodEntry = z.object({
  // 開始年月を確認できていない在籍中の項目も載せられるよう、start は省略可にする。
  start: YearMonth.optional(),
  end: YearMonth.optional(),
  title: CvText,
  detail: CvText.optional(),
  url: z.url().optional(),
  advisor: z.object({ name: CvText, url: z.url().optional() }).optional(),
});

const DatedEntry = z.object({
  date: YearMonth,
  title: CvText,
  detail: CvText.optional(),
  url: z.url().optional(),
});

// 職歴は LinkedIn に任せるので experience は持たない。古いキーが残っていたら strictObject で落とす。
export const CvData = z.strictObject({
  education: z.array(PeriodEntry).default([]),
  grants: z.array(PeriodEntry).default([]),
  awards: z.array(DatedEntry).default([]),
});
export type CvData = z.infer<typeof CvData>;
export type CvText = z.infer<typeof CvText>;
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
