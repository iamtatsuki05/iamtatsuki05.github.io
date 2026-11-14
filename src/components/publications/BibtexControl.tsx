import { useEffect, useId, useRef, useState } from 'react';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';
import type { Locale } from '@/lib/i18n';

type CopyStatus = 'idle' | 'copied' | 'failed';

const labels: Record<
  Locale,
  { show: string; code: string; copy: string; copied: string; failed: string; download: string }
> = {
  ja: {
    show: 'BibTeXを表示',
    code: 'BibTeX',
    copy: 'コピー',
    copied: 'コピーしました',
    failed: 'コピーに失敗しました',
    download: '.bib をダウンロード',
  },
  en: {
    show: 'Show BibTeX',
    code: 'BibTeX',
    copy: 'Copy',
    copied: 'Copied',
    failed: 'Copy failed',
    download: 'Download .bib',
  },
  zh: {
    show: '显示 BibTeX',
    code: 'BibTeX',
    copy: '复制',
    copied: '已复制',
    failed: '复制失败',
    download: '下载 .bib',
  },
  fr: {
    show: 'Afficher le BibTeX',
    code: 'BibTeX',
    copy: 'Copier',
    copied: 'Copié',
    failed: 'Échec de la copie',
    download: 'Télécharger le .bib',
  },
};

export function bibtexKey(bibtex: string): string {
  return /^@\w+\{([^\s,{}]+),/.exec(bibtex.trim())?.[1] ?? 'citation';
}

export function BibtexControl({ bibtex }: { bibtex: string }) {
  const locale = useResolvedPreferredLocale();
  const text = labels[locale];
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<CopyStatus>('idle');
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus('idle'), 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={text.show}
        data-testid="publication-bibtex-toggle"
        className="mt-2 inline-flex min-h-7 items-center gap-1 rounded-full border border-purple-200 bg-purple-50/80 px-2.5 py-1 text-[11px] font-semibold uppercase leading-none tracking-wider text-purple-800 shadow-sm shadow-purple-100 transition hover:-translate-y-px hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 aria-expanded:border-amber-300 aria-expanded:bg-amber-50 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-purple-400/40 dark:bg-purple-500/15 dark:text-purple-100 dark:shadow-none dark:hover:border-amber-300/60 dark:hover:bg-amber-300/10 dark:aria-expanded:bg-amber-300/10 dark:focus-visible:outline-amber-300"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-3.5 shrink-0">
          <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
        </svg>
        BIB
      </button>
      {open ? (
        <div
          id={panelId}
          role="group"
          aria-label={text.code}
          data-card-click-ignore
          data-testid="publication-bibtex-panel"
          className="mx-1.5 mt-1 basis-full cursor-auto rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
        >
          <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-800 dark:text-gray-200">
            <code>{bibtex}</code>
          </pre>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={copy}
              data-status={status}
              className="rounded-md border border-gray-300 px-2 py-1 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {status === 'idle' ? text.copy : text[status]}
            </button>
            <a
              href={`data:application/x-bibtex;charset=utf-8,${encodeURIComponent(bibtex)}`}
              download={`${bibtexKey(bibtex)}.bib`}
              className="rounded-md border border-gray-300 px-2 py-1 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              {text.download}
            </a>
            <span role="status" className="sr-only">
              {status === 'idle' ? '' : text[status]}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
}
