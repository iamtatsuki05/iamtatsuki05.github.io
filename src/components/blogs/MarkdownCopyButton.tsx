"use client";

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { resolvePreferredLocaleFromPath } from '@/lib/localePreference';

type Props = {
  markdown: string;
  className?: string;
};

const copyText: Record<
  Locale,
  {
    default: string;
    success: string;
    failure: string;
    aria: string;
  }
> = {
  ja: {
    default: 'Markdownをコピー',
    success: 'コピーしました',
    failure: 'コピーに失敗しました',
    aria: '記事のMarkdownをコピー',
  },
  en: {
    default: 'Copy Markdown',
    success: 'Copied',
    failure: 'Copy failed',
    aria: 'Copy article markdown',
  },
};

export function MarkdownCopyButton({ markdown, className }: Props) {
  const pathname = usePathname() || '';
  const [locale, setLocale] = useState<Locale>('ja');
  const [status, setStatus] = useState<'default' | 'success' | 'failure'>('default');
  const resetTimerRef = useRef<number | null>(null);
  const disabled = markdown.length === 0;

  useEffect(() => {
    setLocale(resolvePreferredLocaleFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const scheduleReset = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setStatus('default');
      resetTimerRef.current = null;
    }, 1400);
  };

  const handleCopy = async () => {
    if (disabled || typeof navigator === 'undefined') return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(markdown);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = markdown;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setStatus('success');
      scheduleReset();
    } catch {
      setStatus('failure');
      scheduleReset();
    }
  };

  const text = copyText[locale];

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      className={clsx(
        'rounded-full border border-purple-200/70 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30 dark:hover:shadow-amber-700/30',
        className,
      )}
      aria-label={text.aria}
    >
      {text[status]}
    </button>
  );
}
