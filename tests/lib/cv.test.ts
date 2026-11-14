import { describe, expect, it } from 'vitest';
import type { Publication } from '@/lib/content/publication';
import { collectCvAwards, cvText, formatCvPeriod, groupPapersForCv, parseCvData, sortPeriodEntries } from '@/lib/data/cv';

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
    expect(formatCvPeriod({}, '現在')).toBe('現在');
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

  it('puts entries without a start date first, as ongoing', () => {
    const sorted = sortPeriodEntries([
      { start: '2024-04', title: { ja: 'a', en: 'a' } },
      { title: { ja: 'b', en: 'b' } },
    ]);
    expect(sorted.map((e) => e.title.en)).toEqual(['b', 'a']);
  });

  it('rejects the removed experience list', () => {
    expect(() => parseCvData('experience: []\n')).toThrow('experience');
  });

  it('merges paper awards with standalone awards, newest first', () => {
    const awards = collectCvAwards(
      [
        { date: '2025-09', title: { ja: '単独賞', en: 'Standalone award' }, detail: { ja: '主催', en: 'Host' } },
        { date: '2027-01', title: { ja: '新しい賞', en: 'Newer award' } },
      ],
      [
        pub({ slug: 'a', title: 'Awarded paper', award: 'Best Paper', publishedAt: '2026-03-10', links: [{ kind: 'paper', url: 'https://example.com/a' }] }),
        pub({ slug: 'b', title: 'Plain paper', publishedAt: '2026-05-01' }),
      ],
      'en',
    );
    expect(awards).toEqual([
      { date: '2027-01', title: 'Newer award', detail: undefined, url: undefined },
      { date: '2026-03', title: 'Best Paper', paper: { title: 'Awarded paper', url: 'https://example.com/a' } },
      { date: '2025-09', title: 'Standalone award', detail: 'Host', url: undefined },
    ]);
  });

  it('fails when an awarded paper has no date', () => {
    expect(() => collectCvAwards([], [pub({ slug: 'x', award: 'Best Paper' })], 'ja')).toThrow('x');
  });

  it('groups papers by venue type, region, and review and leaves out everything else', () => {
    const grouped = groupPapersForCv([
      pub({ slug: 'dom', venueType: 'conference', region: 'domestic', refereed: false }),
      pub({ slug: 'intl', venueType: 'conference', region: 'international', refereed: true }),
      pub({ slug: 'journal', venueType: 'journal', region: 'domestic', refereed: true }),
      pub({ slug: 'app', type: 'app' }),
      pub({ slug: 'post', type: 'article' }),
    ]);
    expect(grouped.map((g) => [g.key, g.items.map((p) => p.slug)])).toEqual([
      ['journal-domestic-refereed', ['journal']],
      ['conference-international-refereed', ['intl']],
      ['conference-domestic-nonrefereed', ['dom']],
    ]);
  });
});
