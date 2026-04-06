'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { NavDisplayItem } from '@/components/site/navItems';
import { NavLinks } from '@/components/site/NavLinks';

const MENU_ENTER_DELAY_MS = 16;
const MENU_ANIMATION_MS = 280;

type Props = {
  open: boolean;
  onClose: () => void;
  items: NavDisplayItem[];
  activePath: string;
  localePrefix: string;
};

export function MobileMenu({ open, onClose, items, activePath, localePrefix }: Props) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [isRendered, setIsRendered] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setPortalRoot(document.body);
    return () => setPortalRoot(null);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (!portalRoot) return;

    let enterTimer: number | undefined;
    let exitTimer: number | undefined;

    if (open) {
      setIsRendered(true);
      if (prefersReducedMotion) {
        setIsVisible(true);
      } else {
        enterTimer = window.setTimeout(() => setIsVisible(true), MENU_ENTER_DELAY_MS);
      }
    } else if (isRendered) {
      setIsVisible(false);
      if (prefersReducedMotion) {
        setIsRendered(false);
      } else {
        exitTimer = window.setTimeout(() => setIsRendered(false), MENU_ANIMATION_MS);
      }
    }

    return () => {
      if (enterTimer) window.clearTimeout(enterTimer);
      if (exitTimer) window.clearTimeout(exitTimer);
    };
  }, [isRendered, open, portalRoot, prefersReducedMotion]);

  useEffect(() => {
    if (!isRendered) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isRendered]);

  useEffect(() => {
    if (!isRendered) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRendered, onClose]);

  if (!isRendered || !portalRoot) return null;

  const state = isVisible ? 'open' : 'closed';

  return createPortal(
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      data-state={state}
      className="mobile-menu-overlay sm:hidden fixed inset-0 z-[100]"
      onClick={onClose}
    >
      <div
        data-state={state}
        className="mobile-menu-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-menu-panel__content">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-purple-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-amber-100">
                Menu
              </span>
              <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-purple-300 via-amber-200 to-pink-300 opacity-80 dark:from-purple-300 dark:via-amber-200 dark:to-rose-200" />
            </div>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="mobile-menu-close focus-ring"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="mobile-menu__nav">
            <NavLinks
              items={items}
              activePath={activePath}
              localePrefix={localePrefix}
              orientation="vertical"
              onNavigate={() => {
                // Safari系で Link 遷移より先にアンマウントされると遷移が中断されるため1tick遅らせる
                window.setTimeout(onClose, 0);
              }}
            />
          </div>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
