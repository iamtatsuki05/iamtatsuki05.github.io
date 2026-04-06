"use client";

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';

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
  const locale = useResolvedPreferredLocale();
  const [status, setStatus] = useState<'default' | 'success' | 'failure'>('default');
  const resetTimerRef = useRef<number | null>(null);
  const disabled = markdown.length === 0;

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
      data-status={status}
      className={clsx(
        'blog-action-button blog-copy-button',
        className,
      )}
      aria-label={text.aria}
    >
      <span className="blog-action-button__label">{text[status]}</span>
      <span aria-hidden={true} className="blog-copy-button__icon">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blog-copy-button__icon-svg blog-copy-button__icon-svg--copy"
        >
          <rect x="7" y="4.5" width="8.5" height="10.5" rx="2" />
          <path d="M5.5 12.5h-1A2.5 2.5 0 0 1 2 10V5.5A2.5 2.5 0 0 1 4.5 3h4" />
        </svg>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blog-copy-button__icon-svg blog-copy-button__icon-svg--success"
        >
          <path d="M4.5 10.5 8 14l7.5-8" />
        </svg>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blog-copy-button__icon-svg blog-copy-button__icon-svg--failure"
        >
          <path d="m6 6 8 8" />
          <path d="m14 6-8 8" />
        </svg>
      </span>
    </button>
  );
}
