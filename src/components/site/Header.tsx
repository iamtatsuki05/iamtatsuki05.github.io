"use client";
import Link from '@/components/compat/Link';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { usePathname } from '@/lib/compat/navigation';
import { ThemeProvider } from '@/lib/compat/theme';
import { useEffect, useMemo, useState } from 'react';
import { NavLinks } from '@/components/site/NavLinks';
import { resolveNavItems } from '@/components/site/navItems';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { localeToRouteLocale } from '@/lib/i18n';
import { MobileMenu } from '@/components/site/MobileMenu';
import { withBasePath } from '@/lib/url';

type HeaderProps = {
  currentPath?: string;
};

const STILL_ICON_TRANSFORM = 'translate3d(0, 0px, 0) scaleX(1.000) scaleY(1.000) rotate(0deg)';

function getScrollIconTransform(scrollY: number) {
  if (!Number.isFinite(scrollY) || scrollY <= 0) {
    return STILL_ICON_TRANSFORM;
  }

  const impactPhase = scrollY % 120;
  const impactSquash = impactPhase < 28 ? 1 - impactPhase / 28 : 0;
  const reboundStretch = impactPhase >= 28 && impactPhase < 68 ? 1 - Math.abs((impactPhase - 48) / 20) : 0;
  const tiredSquash = Math.min(scrollY / 900, 1) * 0.08;
  const squash = Math.min(1, Math.max(impactSquash, Math.abs(Math.sin(scrollY / 38)) * 0.35) + tiredSquash);
  const scaleX = 1 + squash * 0.24 - reboundStretch * 0.08;
  const scaleY = 1 - squash * 0.24 + reboundStretch * 0.18;
  const hop = Math.round(impactSquash * 3 - reboundStretch * 5);
  const rotation = Math.round(Math.sin(scrollY / 64) * 3 - impactSquash);

  return `translate3d(0, ${hop}px, 0) scaleX(${scaleX.toFixed(3)}) scaleY(${scaleY.toFixed(3)}) rotate(${rotation}deg)`;
}

export function Header({ currentPath }: HeaderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <HeaderContent currentPath={currentPath} />
    </ThemeProvider>
  );
}

function HeaderContent({ currentPath }: HeaderProps) {
  const pathname = usePathname(currentPath) || '';
  const [open, setOpen] = useState(false);
  const [iconTransform, setIconTransform] = useState(STILL_ICON_TRANSFORM);
  const locale = extractLocaleFromPath(pathname) || 'ja';
  const localePrefix = `/${localeToRouteLocale(locale)}`;
  const activePath = pathname;

  const navItems = useMemo(() => resolveNavItems(locale), [locale]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) {
      setIconTransform(STILL_ICON_TRANSFORM);
      return;
    }

    const updateIconTransform = () => {
      setIconTransform(getScrollIconTransform(window.scrollY));
    };

    updateIconTransform();
    window.addEventListener('scroll', updateIconTransform, { passive: true });
    return () => window.removeEventListener('scroll', updateIconTransform);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-purple-100/70 bg-gradient-to-r from-[#f8f5ff]/85 via-[#fff6e6]/90 to-[#f4eeff]/85 backdrop-blur-sm shadow-sm dark:border-purple-500/40 dark:from-[#120d1f]/90 dark:via-[#0f0a17]/90 dark:to-[#140f24]/88">
      <div className="container mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-4">
        <Link
          href={localizedPath('/', locale)}
          className="flex min-w-0 flex-1 items-center gap-3 truncate text-lg font-semibold sm:flex-none"
        >
          <img
            src={withBasePath('/icon-192x192.png')}
            alt=""
            aria-hidden="true"
            data-testid="header-personal-icon"
            className="h-7 w-7 shrink-0 rounded-full border border-white/70 bg-white/80 object-cover shadow-sm transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none dark:border-white/15 dark:bg-gray-950/70"
            style={{ transform: iconTransform, transformOrigin: '50% 85%' }}
          />
          <span className="truncate bg-gradient-to-r from-purple-400 via-amber-300 to-purple-500 bg-clip-text text-transparent dark:from-purple-300 dark:via-amber-200 dark:to-purple-200">
            Tatsuki Okada
          </span>
        </Link>
        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden sm:flex items-center gap-4">
          <NavLinks items={navItems} activePath={activePath} localePrefix={localePrefix} />
          <LanguageSwitch currentPath={pathname} />
          <ThemeToggle />
        </nav>

        {/* Mobile buttons */}
        <div className="sm:hidden flex items-center gap-2">
          <LanguageSwitch currentPath={pathname} />
          <ThemeToggle />
          <button
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
            className="mobile-menu-trigger flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/75 text-gray-700 shadow-[0_18px_36px_-28px_rgba(192,132,252,0.9)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-white/90 dark:border-white/10 dark:bg-[#171022]/80 dark:text-gray-100 dark:hover:border-amber-200/30 dark:hover:bg-[#1d1630]/88 focus-ring"
          >
            <span aria-hidden="true" className="flex flex-col items-center gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={navItems}
        activePath={activePath}
        localePrefix={localePrefix}
      />
    </header>
  );
}
