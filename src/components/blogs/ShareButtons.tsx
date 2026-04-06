"use client";

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n';
import { useResolvedPreferredLocale } from '@/hooks/useResolvedPreferredLocale';

type Props = {
  url: string;
  title: string;
  className?: string;
};

const shareText: Record<
  Locale,
  {
    share: string;
    shareOnX: string;
    shareOnLinkedIn: string;
  }
> = {
  ja: {
    share: '共有',
    shareOnX: 'Xでシェア',
    shareOnLinkedIn: 'LinkedInでシェア',
  },
  en: {
    share: 'Share',
    shareOnX: 'Share on X',
    shareOnLinkedIn: 'Share on LinkedIn',
  },
};

export function ShareButtons({ url, title, className }: Props) {
  const locale = useResolvedPreferredLocale();
  const [activeAction, setActiveAction] = useState<'share' | 'x' | 'linkedin' | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const triggerFeedback = (action: 'share' | 'x' | 'linkedin') => {
    if (typeof window === 'undefined') return;
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    setActiveAction(action);
    resetTimerRef.current = window.setTimeout(() => {
      setActiveAction(null);
      resetTimerRef.current = null;
    }, 520);
  };

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return;
    triggerFeedback('share');
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
  const text = shareText[locale];

  return (
    <div className={clsx('blog-share-actions flex flex-wrap gap-3', className)}>
      <button
        type="button"
        onClick={handleShare}
        data-state={activeAction === 'share' ? 'active' : 'idle'}
        data-variant="share"
        className="blog-action-button blog-action-button--share"
      >
        <span className="blog-action-button__label">{text.share}</span>
        <span aria-hidden={true} className="blog-action-button__badge" />
      </button>
      <a
        href={xUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => triggerFeedback('x')}
        data-state={activeAction === 'x' ? 'active' : 'idle'}
        data-variant="x"
        className="blog-action-button blog-action-button--share"
      >
        <span className="blog-action-button__label">{text.shareOnX}</span>
        <span aria-hidden={true} className="blog-action-button__badge" />
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => triggerFeedback('linkedin')}
        data-state={activeAction === 'linkedin' ? 'active' : 'idle'}
        data-variant="linkedin"
        className="blog-action-button blog-action-button--share"
      >
        <span className="blog-action-button__label">{text.shareOnLinkedIn}</span>
        <span aria-hidden={true} className="blog-action-button__badge" />
      </a>
    </div>
  );
}
