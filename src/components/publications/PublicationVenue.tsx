import { SearchHighlight } from '@/components/search/SearchHighlight';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n';

type Props = {
  publishedAt?: string;
  venue?: string;
  publisher?: string;
  venueFull?: string;
  pages?: string;
  location?: string;
  locale: Locale;
  query?: string;
};

const CJK = /[぀-ヿ㐀-鿿]/;

function formatMonth(publishedAt: string | undefined, locale: Locale, japanese: boolean): string | null {
  const match = publishedAt?.match(/^(\d{4})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
  return new Intl.DateTimeFormat(japanese ? 'ja-JP' : LOCALE_LABELS[locale], {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(date);
}

export function formatVenueCitation({
  publishedAt,
  venue,
  venueFull,
  pages,
  location,
  locale,
}: Omit<Props, 'publisher' | 'query'>): string {
  // 和文の会議名は UI の言語に関係なく和文の句読点と年月で書く。
  const japanese = CJK.test(venueFull ?? venue ?? '');
  const name = venueFull ? (venue ? `${venueFull} (${venue})` : venueFull) : venue;
  const pageRange = pages ? `${pages.includes('-') ? 'pp.' : 'p.'} ${pages.replace('-', '–')}` : null;
  const parts = [name, pageRange, formatMonth(publishedAt, locale, japanese), location].filter(Boolean);
  return parts.join(japanese ? '、' : ', ') + (japanese ? '。' : '.');
}

export function PublicationVenue({ publisher, query = '', ...citation }: Props) {
  const { publishedAt, venue, venueFull, pages, location } = citation;
  if (!venueFull && !pages && !location) {
    return (
      <p className="text-xs opacity-70">
        {(publishedAt || '').slice(0, 10)} ・ <SearchHighlight text={venue || publisher || ''} query={query} />
      </p>
    );
  }
  return (
    <p className="text-xs opacity-70" data-testid="publication-venue">
      <SearchHighlight text={formatVenueCitation(citation)} query={query} />
    </p>
  );
}
