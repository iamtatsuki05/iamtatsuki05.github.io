export type UiLocale = 'ja' | 'en';

function normalizeDate(input: string | Date | undefined | null): Date | null {
  if (!input) return null;
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatIsoParts(date: Date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return { y, m, d };
}

export function formatDate(dateLike: string, locale: UiLocale = 'ja') {
  const date = normalizeDate(dateLike);
  if (!date) return (dateLike || '').toString().slice(0, 10);
  const { y, m, d } = formatIsoParts(date);
  return locale === 'ja' ? `${y}/${m}/${d}` : `${y}-${m}-${d}`;
}
