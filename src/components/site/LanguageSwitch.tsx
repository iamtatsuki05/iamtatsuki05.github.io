"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 簡易実装: トップのみja/enを切替（他ページは言語非対応）
export function LanguageSwitch() {
  const pathname = usePathname() || '';

  // 対応ページ: /, /links, /publications, /blogs（ロケール有無）
  const translatable = (p: string) => {
    if (!p) return false;
    if (p === '/' || p === '/ja/' || p === '/en/') return true;
    const bare = p.replace(/^\/(ja|en)/, '');
    return ['/', '/links/', '/publications/', '/blogs/'].includes(bare.endsWith('/') ? bare : bare + '/');
  };

  if (!translatable(pathname)) {
    return <span className="text-sm opacity-60">JA/EN</span>;
  }

  const rest = pathname.replace(/^\/(ja|en)/, '');
  const toJa = rest === '/' ? '/ja/' : `/ja${rest.endsWith('/') ? rest : rest + '/'}`;
  const toEn = rest === '/' ? '/en/' : `/en${rest.endsWith('/') ? rest : rest + '/'}`;

  return (
    <span className="text-sm">
      <Link href={toJa} className="mr-1 underline">JA</Link>/
      <Link href={toEn} className="ml-1 underline">EN</Link>
    </span>
  );
}
