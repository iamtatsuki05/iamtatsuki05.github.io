"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALE_UI_LABELS } from '@/lib/i18n';
import { extractLocaleFromPath, isTranslatablePath, localizedPath, stripLocalePrefix } from '@/lib/routing';
import { writePreferredLocale } from '@/lib/localePreference';

export function LanguageSwitch() {
  const indicatorInsetPx = 4;
  const pathname = usePathname() || '';
  const currentLocale = extractLocaleFromPath(pathname) || 'ja';
  const isTranslatable = isTranslatablePath(pathname);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const optionRefs = React.useRef<Record<'ja' | 'en', HTMLSpanElement | null>>({ ja: null, en: null });
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties | null>(null);

  React.useEffect(() => {
    const locale = extractLocaleFromPath(pathname);
    if (locale) {
      writePreferredLocale(locale);
    }
  }, [pathname]);

  const updateIndicator = React.useCallback(() => {
    const group = groupRef.current;
    const activeOption = optionRefs.current[currentLocale];
    if (!group || !activeOption) return;

    const groupRect = group.getBoundingClientRect();
    const optionRect = activeOption.getBoundingClientRect();
    setIndicatorStyle({
      width: `${optionRect.width}px`,
      transform: `translateX(${optionRect.left - groupRect.left - indicatorInsetPx}px)`,
    });
  }, [currentLocale, indicatorInsetPx]);

  React.useEffect(() => {
    updateIndicator();

    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTranslatable, pathname, updateIndicator]);

  const bare = stripLocalePrefix(pathname);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const toJa = localizedPath(normalized, 'ja');
  const toEn = localizedPath(normalized, 'en');
  const options = [
    { locale: 'ja', href: toJa, label: LOCALE_UI_LABELS.ja },
    { locale: 'en', href: toEn, label: LOCALE_UI_LABELS.en },
  ] as const;

  const baseOptionClass = 'inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] no-underline hover:no-underline transition-[color,transform] duration-200 focus-ring';
  const activeOptionClass = 'text-[#2a143f] dark:text-[#2a143f]';
  const inactiveOptionClass = 'text-gray-700 hover:text-purple-600 hover:-translate-y-px dark:text-gray-200 dark:hover:text-amber-200';
  const disabledOptionClass = 'cursor-default text-gray-500 dark:text-gray-400';

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label="Language switch"
      aria-disabled={isTranslatable ? undefined : true}
      className="relative inline-flex items-center gap-1 overflow-hidden rounded-full border border-purple-200/80 bg-white/75 p-1 shadow-[0_10px_25px_-18px_rgba(126,34,206,0.85)] backdrop-blur-sm dark:border-amber-300/40 dark:bg-[#140f24]/85"
    >
      <span
        aria-hidden="true"
        data-testid="language-switch-indicator"
        data-active-locale={currentLocale}
        className="pointer-events-none absolute top-1 bottom-1 left-1 rounded-full bg-gradient-to-r from-purple-400 via-purple-300 to-amber-300 shadow-[0_12px_24px_-18px_rgba(126,34,206,0.9)] transition-[transform,width,opacity] duration-300 ease-out dark:from-purple-300 dark:via-purple-200 dark:to-amber-200"
        style={{
          opacity: indicatorStyle ? 1 : 0,
          width: indicatorStyle?.width,
          transform: indicatorStyle?.transform,
        }}
      />
      {options.map((option) => {
        const isCurrent = currentLocale === option.locale;
        const className = [
          baseOptionClass,
          isCurrent ? activeOptionClass : inactiveOptionClass,
          !isTranslatable && !isCurrent ? disabledOptionClass : '',
        ].join(' ');

        if (!isTranslatable) {
          return (
            <span
              key={option.locale}
              ref={(node) => {
                optionRefs.current[option.locale] = node;
              }}
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
            ref={(node) => {
              optionRefs.current[option.locale] = node;
            }}
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
