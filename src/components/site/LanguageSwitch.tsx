"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { extractLocaleFromPath, isTranslatablePath, localizedPath, stripLocalePrefix } from '@/lib/routing';

// 簡易実装: トップのみja/enを切替（他ページは言語非対応）
export function LanguageSwitch() {
  const pathname = usePathname() || '';

  if (!isTranslatablePath(pathname)) {
    return <span className="text-sm opacity-60">JA/EN</span>;
  }

  const currentLocale = extractLocaleFromPath(pathname) || 'ja';
  const bare = stripLocalePrefix(pathname);
  const normalized = bare.endsWith('/') ? bare : `${bare}/`;
  const toJa = localizedPath(normalized, 'ja');
  const toEn = localizedPath(normalized, 'en');

  return (
    <span className="text-sm">
      <Link href={toJa} className="mr-1 underline" aria-current={currentLocale === 'ja' ? 'true' : undefined}>JA</Link>/
      <Link href={toEn} className="ml-1 underline" aria-current={currentLocale === 'en' ? 'true' : undefined}>EN</Link>
    </span>
  );
}
