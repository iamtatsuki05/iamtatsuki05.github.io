import type { NavDisplayItem } from '@/components/site/navItems';
import { NavLinks } from '@/components/site/NavLinks';

type Props = {
  items: NavDisplayItem[];
  activePath: string;
  localePrefix: string;
};

/** Rendered inside a <template>; headerController clones it into <body> on open and removes it after closing. */
export function MobileMenu({ items, activePath, localePrefix }: Props) {
  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden="false"
      data-state="closed"
      className="mobile-menu-overlay xl:hidden fixed inset-0 z-[100]"
      data-mobile-menu-overlay
    >
      <div data-state="closed" className="mobile-menu-panel" data-mobile-menu-panel>
        <div className="mobile-menu-panel__content">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <span className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-purple-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-amber-100">
                Menu
              </span>
              <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-purple-300 via-amber-200 to-pink-300 opacity-80 dark:from-purple-300 dark:via-amber-200 dark:to-rose-200" />
            </div>
            <button
              type="button"
              aria-label="Close menu"
              data-mobile-menu-close
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
