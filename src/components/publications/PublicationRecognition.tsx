import type { PublicationCardItem } from '@/components/publications/PublicationCard';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n';

type Props = Pick<PublicationCardItem, 'acceptance' | 'award'> & { locale: Locale };

const acceptanceLabels: Record<Locale, string> = {
  ja: '採択率',
  en: 'Acceptance rate',
  zh: '录用率',
  fr: "Taux d'acceptation",
};

export function PublicationRecognition({ acceptance, award, locale }: Props) {
  if (!acceptance && !award) return null;
  const rate = acceptance
    ? new Intl.NumberFormat(LOCALE_LABELS[locale], { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
        acceptance.accepted / acceptance.submitted,
      )
    : null;

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
      {award ? (
        <span
          data-testid="publication-award"
          className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 dark:border-amber-300/50 dark:bg-amber-500/15 dark:text-amber-100"
        >
          <span aria-hidden="true">🏆</span>
          {award}
        </span>
      ) : null}
      {acceptance ? (
        <a
          href={acceptance.source}
          target="_blank"
          rel="noreferrer"
          data-testid="publication-acceptance"
          className="rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-purple-800 underline-offset-2 hover:underline dark:border-purple-300/40 dark:bg-purple-500/15 dark:text-purple-100"
        >
          {acceptanceLabels[locale]} {rate} ({acceptance.accepted}/{acceptance.submitted})
        </a>
      ) : null}
    </div>
  );
}
