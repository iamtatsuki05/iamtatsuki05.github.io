"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALE_UI_LABELS } from '@/lib/i18n';
import { extractLocaleFromPath, isTranslatablePath, localizedPath, stripLocalePrefix } from '@/lib/routing';

export function LanguageSwitch() {
  const pathname = usePathname() || '';
  const currentLocale = extractLocaleFromPath(pathname) || 'ja';
  const isTranslatable = isTranslatablePath(pathname);

  const bare = stripLocalePrefix(pathname);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const toJa = localizedPath(normalized, 'ja');
  const toEn = localizedPath(normalized, 'en');
  const options = [
    { locale: 'ja', href: toJa, label: LOCALE_UI_LABELS.ja },
    { locale: 'en', href: toEn, label: LOCALE_UI_LABELS.en },
  ] as const;

  const baseOptionClass = 'inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] no-underline hover:no-underline transition-colors focus-ring';
  const activeOptionClass = 'bg-gradient-to-r from-purple-400 via-purple-300 to-amber-300 text-[#2a143f] shadow-sm dark:from-purple-300 dark:via-purple-200 dark:to-amber-200';
  const inactiveOptionClass = 'text-gray-700 hover:bg-purple-50 hover:text-purple-600 dark:text-gray-200 dark:hover:bg-[#2a1a44] dark:hover:text-amber-200';
  const disabledOptionClass = 'cursor-default text-gray-500 dark:text-gray-400';

  return (
    <div
      role="group"
      aria-label="Language switch"
      aria-disabled={isTranslatable ? undefined : true}
      className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-white/75 p-1 shadow-[0_10px_25px_-18px_rgba(126,34,206,0.85)] backdrop-blur-sm dark:border-amber-300/40 dark:bg-[#140f24]/85"
    >
      {options.map((option) => {
        const isCurrent = currentLocale === option.locale;
        const className = [
          baseOptionClass,
          isCurrent ? activeOptionClass : inactiveOptionClass,
          !isTranslatable && !isCurrent ? disabledOptionClass : '',
        ].join(' ');

        if (!isTranslatable) {
          return (
            <span key={option.locale} className={className} aria-current={isCurrent ? 'true' : undefined}>
              {option.label}
            </span>
          );
        }

        return (
          <Link key={option.locale} href={option.href} className={className} aria-current={isCurrent ? 'true' : undefined}>
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
