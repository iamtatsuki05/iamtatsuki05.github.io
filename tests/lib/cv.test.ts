import { describe, expect, it } from 'vitest';
import type { Publication } from '@/lib/content/publication';
import { cvText, formatCvPeriod, groupPapersForCv, parseCvData, sortPeriodEntries } from '@/lib/data/cv';

const pub = (overrides: Partial<Publication>): Publication => ({
  slug: overrides.slug ?? 'p',
  title: 't',
  type: 'paper',
  authors: [],
  links: [],
  tags: [],
  ...overrides,
});

describe('cv data', () => {
  it('parses entries and defaults missing sections to empty lists', () => {
    const cv = parseCvData(`
education:
  - start: 2024-04
    title: { ja: 学校, en: School }
`);
    expect(cv.education[0].start).toBe('2024-04');
    expect(cv.awards).toEqual([]);
  });

  it('fails with the file path when a date is not YYYY-MM', () => {
    expect(() =>
      parseCvData(
        `awards:\n  - date: 2024-4\n    title: { ja: 賞, en: Award }\n`,
        '/tmp/cv.yaml',
      ),
    ).toThrow('/tmp/cv.yaml');
  });

  it('formats periods and shows ongoing ones with the present label', () => {
    expect(formatCvPeriod({ start: '2024-04', end: '2026-03' }, '現在')).toBe('2024.04 – 2026.03');
    expect(formatCvPeriod({ start: '2026-04' }, 'Present')).toBe('2026.04 – Present');
  });

  it('shows Japanese text on ja and English text on every other locale', () => {
    const text = { ja: '学校', en: 'School' };
    expect(cvText(text, 'ja')).toBe('学校');
    expect(cvText(text, 'fr')).toBe('School');
  });

  it('sorts periods newest first', () => {
    const sorted = sortPeriodEntries([
      { start: '2020-04', title: { ja: 'a', en: 'a' } },
      { start: '2024-04', title: { ja: 'b', en: 'b' } },
    ]);
    expect(sorted.map((e) => e.start)).toEqual(['2024-04', '2020-04']);
  });

  it('groups papers by region and review and leaves out everything else', () => {
    const grouped = groupPapersForCv([
      pub({ slug: 'dom', region: 'domestic', refereed: false }),
      pub({ slug: 'intl', region: 'international', refereed: true }),
      pub({ slug: 'app', type: 'app' }),
      pub({ slug: 'post', type: 'article' }),
    ]);
    expect(grouped.map((g) => [g.key, g.items.map((p) => p.slug)])).toEqual([
      ['international-refereed', ['intl']],
      ['domestic-nonrefereed', ['dom']],
    ]);
  });
});
