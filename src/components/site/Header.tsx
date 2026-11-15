import Link from '@/components/compat/Link';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { MobileMenu } from '@/components/site/MobileMenu';
import { NavLinks } from '@/components/site/NavLinks';
import { resolveNavItems } from '@/components/site/navItems';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { STILL_ICON_TRANSFORM } from '@/components/site/headerMotion';
import { localeToRouteLocale } from '@/lib/i18n';
import { extractLocaleFromPath, localizedPath } from '@/lib/routing';
import { withBasePath } from '@/lib/url';

type HeaderProps = {
  currentPath?: string;
};

/** Static markup only: `initHeader` in headerController.ts wires theme, language pill, menu, and icon motion. */
export function Header({ currentPath = '' }: HeaderProps) {
  const pathname = currentPath;
  const locale = extractLocaleFromPath(pathname) || 'ja';
  const localePrefix = `/${localeToRouteLocale(locale)}`;
  const activePath = pathname;
  const navItems = resolveNavItems(locale);

  return (
    <header data-site-header data-current-path={pathname} className="fixed inset-x-0 top-0 z-50 border-b border-purple-100/70 bg-gradient-to-r from-[#f8f5ff]/85 via-[#fff6e6]/90 to-[#f4eeff]/85 backdrop-blur-sm shadow-sm dark:border-purple-500/40 dark:from-[#120d1f]/90 dark:via-[#0f0a17]/90 dark:to-[#140f24]/88">
      <div className="container mx-auto flex max-w-screen-2xl items-center justify-between gap-3 px-4 py-4">
        <Link
          href={localizedPath('/', locale)}
          className="flex min-w-0 flex-1 items-center gap-3 truncate text-lg font-semibold xl:flex-none"
        >
          <img
            src={withBasePath('/header-icon-56.webp')}
            srcSet={`${withBasePath('/header-icon-56.webp')} 1x, ${withBasePath('/header-icon-112.webp')} 2x`}
            width={28}
            height={28}
            alt=""
            aria-hidden="true"
            data-testid="header-personal-icon"
            className="h-7 w-7 shrink-0 rounded-full border border-white/70 bg-white/80 object-cover shadow-sm transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none dark:border-white/15 dark:bg-gray-950/70"
            style={{ transform: STILL_ICON_TRANSFORM, transformOrigin: '50% 85%' }}
          />
          <span className="truncate text-purple-800 max-[32rem]:sr-only dark:text-purple-200">
            Tatsuki Okada
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-4">
          <NavLinks items={navItems} activePath={activePath} localePrefix={localePrefix} />
          <LanguageSwitch currentPath={pathname} />
          <ThemeToggle />
        </nav>

        <div className="xl:hidden flex items-center gap-2">
          <LanguageSwitch currentPath={pathname} />
          <ThemeToggle />
          <button
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="mobile-menu"
            data-mobile-menu-open
            className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/75 text-gray-700 shadow-[0_18px_36px_-28px_rgba(192,132,252,0.9)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-white/90 dark:border-white/10 dark:bg-[#171022]/80 dark:text-gray-100 dark:hover:border-amber-200/30 dark:hover:bg-[#1d1630]/88 focus-ring"
          >
            <span aria-hidden="true" className="flex flex-col items-center gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>
      </div>

      <template data-mobile-menu-template>
        <MobileMenu items={navItems} activePath={activePath} localePrefix={localePrefix} />
      </template>
    </header>
  );
}
