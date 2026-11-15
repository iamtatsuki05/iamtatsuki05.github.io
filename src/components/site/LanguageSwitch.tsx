import Link from '@/components/compat/Link';
import { LOCALE_UI_LABELS, SUPPORTED_LOCALES } from '@/lib/i18n';
import { extractLocaleFromPath, isTranslatablePath, localizedPath, stripLocalePrefix } from '@/lib/routing';

type LanguageSwitchProps = {
  currentPath?: string;
};

/** Static markup; headerController positions the indicator pill and remembers the locale. */
export function LanguageSwitch({ currentPath = '' }: LanguageSwitchProps) {
  const pathname = currentPath;
  const currentLocale = extractLocaleFromPath(pathname) || 'ja';
  const isTranslatable = isTranslatablePath(pathname);

  const bare = stripLocalePrefix(pathname);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const options = SUPPORTED_LOCALES.map((locale) => ({
    locale,
    href: localizedPath(normalized, locale),
    label: LOCALE_UI_LABELS[locale],
  }));

  const baseOptionClass = 'language-switch-option inline-flex min-w-9 items-center justify-center rounded-full px-2 py-1 text-[11px] font-semibold tracking-[0.08em] no-underline hover:no-underline transition-[color,transform] duration-200 focus-ring sm:min-w-10 sm:px-2.5';
  // The active option's color is added by headerController together with the pill: before the pill shows,
  // a dark label would sit on the dark shell.
  const inactiveOptionClass = 'text-gray-700 hover:text-purple-600 hover:-translate-y-px dark:text-gray-200 dark:hover:text-amber-200';
  const disabledOptionClass = 'cursor-default text-gray-500 dark:text-gray-400';

  return (
    <div
      data-language-switch
      role="group"
      aria-label="Language switch"
      aria-disabled={isTranslatable ? undefined : true}
      className="language-switch-shell relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-purple-200/80 bg-white/75 p-1 shadow-[0_10px_25px_-18px_rgba(126,34,206,0.85)] backdrop-blur-sm dark:border-amber-300/40 dark:bg-[#140f24]/85"
    >
      <span
        aria-hidden="true"
        data-testid="language-switch-indicator"
        data-active-locale={currentLocale}
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-400 via-purple-300 to-amber-300 shadow-[0_12px_24px_-18px_rgba(126,34,206,0.9)] transition-[transform,width,opacity] duration-300 ease-out dark:from-purple-300 dark:via-purple-200 dark:to-amber-200"
        style={{ opacity: 0 }}
      />
      {options.map((option) => {
        const isCurrent = currentLocale === option.locale;
        const className = [
          baseOptionClass,
          isCurrent ? '' : inactiveOptionClass,
          !isTranslatable && !isCurrent ? disabledOptionClass : '',
        ].join(' ');

        if (!isTranslatable) {
          return (
            <span
              key={option.locale}
              data-language-option={option.locale}
              className="relative z-10 flex"
            >
              <span className={className} aria-current={isCurrent ? 'true' : undefined}>
                {option.label}
              </span>
            </span>
          );
        }

        return (
          <span
            key={option.locale}
            data-language-option={option.locale}
            className="relative z-10 flex"
          >
            <Link href={option.href} className={className} aria-current={isCurrent ? 'true' : undefined}>
              {option.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
