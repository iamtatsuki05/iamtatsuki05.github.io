"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { resolvePreferredLocaleFromPath } from '@/lib/localePreference';

export function useResolvedPreferredLocale(defaultLocale: Locale = 'ja') {
  const pathname = usePathname() || '';
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocale(resolvePreferredLocaleFromPath(pathname));
  }, [pathname]);

  return locale;
}
