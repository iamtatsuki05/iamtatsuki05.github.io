"use client";

import React, { useState } from 'react';
import clsx from 'clsx';

type Props = {
  url: string;
  title: string;
  className?: string;
};

export function ShareButtons({ url, title, className }: Props) {
  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({ url, title });
      } catch {
        // noop (user cancelled)
      }
      return;
    }
    // fallback: open share links
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className={clsx('flex flex-wrap gap-3', className)}>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-full border border-purple-200/70 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30 dark:hover:shadow-amber-700/30"
      >
        共有
      </button>
      <a
        href={xUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-purple-200/70 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30 dark:hover:shadow-amber-700/30"
      >
        Xでシェア
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border border-purple-200/70 bg-white px-3 py-1 text-sm text-gray-900 shadow-sm shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-200 dark:border-amber-400/40 dark:bg-[#0f172a] dark:text-purple-50 dark:shadow-amber-900/30 dark:hover:shadow-amber-700/30"
      >
        LinkedInでシェア
      </a>
    </div>
  );
}
