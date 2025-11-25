import React from 'react';
import { createPortal } from 'react-dom';
import type { NavDisplayItem } from '@/components/site/navItems';
import { NavLinks } from '@/components/site/NavLinks';

type Props = {
  open: boolean;
  onClose: () => void;
  items: NavDisplayItem[];
  activePath: string;
  localePrefix: string;
};

export function MobileMenu({ open, onClose, items, activePath, localePrefix }: Props) {
  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      className="sm:hidden fixed inset-0 z-[100] bg-black/20 hover:bg-black/30 transition-colors"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl p-4 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Menu</span>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus-ring"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <NavLinks
          items={items}
          activePath={activePath}
          localePrefix={localePrefix}
          orientation="vertical"
          onNavigate={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}
