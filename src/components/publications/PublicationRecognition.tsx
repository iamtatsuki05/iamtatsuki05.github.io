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
  const ratio = acceptance ? ('rate' in acceptance ? acceptance.rate / 100 : acceptance.accepted / acceptance.submitted) : null;
  const rate =
    ratio === null
      ? null
      : new Intl.NumberFormat(LOCALE_LABELS[locale], { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(ratio);
  const counts = acceptance && 'accepted' in acceptance ? ` (${acceptance.accepted}/${acceptance.submitted})` : '';
  const chipClass =
    'rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-purple-800 dark:border-purple-300/40 dark:bg-purple-500/15 dark:text-purple-100';

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
      {acceptance?.source ? (
        <a
          href={acceptance.source}
          target="_blank"
          rel="noreferrer"
          data-testid="publication-acceptance"
          className={`${chipClass} underline-offset-2 hover:underline`}
        >
          {acceptanceLabels[locale]} {rate}
          {counts}
        </a>
      ) : acceptance ? (
        <span data-testid="publication-acceptance" className={chipClass}>
          {acceptanceLabels[locale]} {rate}
          {counts}
        </span>
      ) : null}
    </div>
  );
}
