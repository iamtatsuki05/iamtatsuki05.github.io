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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const xUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const text = shareText[locale];
  const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (rootRef.current?.contains(target)) return;
      setIsMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

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
    setIsMenuOpen(false);
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

  return (
    <div ref={rootRef} className={clsx('blog-share-actions', className)}>
      <button
        type="button"
        onClick={() => setIsMenuOpen((current) => !current)}
        data-state={isMenuOpen || activeAction === 'share' ? 'active' : 'idle'}
        data-variant="share"
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label={text.share}
        className="blog-action-button blog-action-button--share blog-action-button--icon"
      >
        <span aria-hidden={true} className="blog-action-button__icon">
          <svg viewBox="0 0 20 20" className="blog-action-button__icon-svg" focusable="false">
            <path
              d="M13.5 3.5a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 13.5 3.5ZM5.5 8a2.5 2.5 0 1 1-.001 5.001A2.5 2.5 0 0 1 5.5 8Zm8 3.5a2.5 2.5 0 1 1-.001 5.001 2.5 2.5 0 0 1 .001-5.001Zm-5.77-.95 3.34-1.72m-3.34 2.34 3.34 1.73"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="sr-only">{text.share}</span>
      </button>

      {isMenuOpen ? (
        <div className="blog-share-menu" role="menu" aria-label={text.share}>
          {supportsNativeShare ? (
            <button
              type="button"
              onClick={handleShare}
              data-state={activeAction === 'share' ? 'active' : 'idle'}
              data-variant="share"
              className="blog-action-button blog-action-button--share blog-action-button--menu-item"
              role="menuitem"
            >
              <span className="blog-action-button__label">{text.share}</span>
              <span aria-hidden={true} className="blog-action-button__badge" />
            </button>
          ) : null}
          <a
            href={xUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              triggerFeedback('x');
              setIsMenuOpen(false);
            }}
            data-state={activeAction === 'x' ? 'active' : 'idle'}
            data-variant="x"
            className="blog-action-button blog-action-button--share blog-action-button--menu-item"
            role="menuitem"
          >
            <span className="blog-action-button__label">{text.shareOnX}</span>
            <span aria-hidden={true} className="blog-action-button__badge" />
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              triggerFeedback('linkedin');
              setIsMenuOpen(false);
            }}
            data-state={activeAction === 'linkedin' ? 'active' : 'idle'}
            data-variant="linkedin"
            className="blog-action-button blog-action-button--share blog-action-button--menu-item"
            role="menuitem"
          >
            <span className="blog-action-button__label">{text.shareOnLinkedIn}</span>
            <span aria-hidden={true} className="blog-action-button__badge" />
          </a>
        </div>
      ) : null}
    </div>
  );
}
