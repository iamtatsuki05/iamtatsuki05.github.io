import { useEffect, useId, useRef, useState } from 'react';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';
import type { Locale } from '@/lib/i18n';

type CopyStatus = 'idle' | 'copied' | 'failed';

const labels: Record<
  Locale,
  { show: string; hide: string; code: string; copy: string; copied: string; failed: string; download: string }
> = {
  ja: {
    show: 'BibTeXを表示',
    hide: 'BibTeXを閉じる',
    code: 'BibTeX',
    copy: 'コピー',
    copied: 'コピーしました',
    failed: 'コピーに失敗しました',
    download: '.bib をダウンロード',
  },
  en: {
    show: 'Show BibTeX',
    hide: 'Hide BibTeX',
    code: 'BibTeX',
    copy: 'Copy',
    copied: 'Copied',
    failed: 'Copy failed',
    download: 'Download .bib',
  },
  zh: {
    show: '显示 BibTeX',
    hide: '收起 BibTeX',
    code: 'BibTeX',
    copy: '复制',
    copied: '已复制',
    failed: '复制失败',
    download: '下载 .bib',
  },
  fr: {
    show: 'Afficher le BibTeX',
    hide: 'Masquer le BibTeX',
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
        aria-controls={panelId}
        aria-label={open ? text.hide : text.show}
        data-testid="publication-bibtex-toggle"
        className="inline-flex min-h-6 items-center px-1.5 py-1 underline"
      >
        BIB
      </button>
      <div
        id={panelId}
        hidden={!open}
        role="group"
        aria-label={text.code}
        data-card-click-ignore
        data-testid="publication-bibtex-panel"
        className="mx-1.5 mt-1 basis-full cursor-auto rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900"
      >
        <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed text-gray-800 dark:text-gray-200"
        >
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
    </>
  );
}
