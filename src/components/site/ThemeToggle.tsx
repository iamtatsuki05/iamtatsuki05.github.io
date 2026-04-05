"use client";
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || !resolvedTheme) {
    return <span className="inline-block h-11 w-11" aria-hidden />; // SSRと一致させるためプレースホルダ
  }
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';
  return (
    <button
      aria-label="Toggle theme"
      data-theme={resolvedTheme}
      data-next-theme={next}
      onClick={() => setTheme(next)}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-[1.15rem] border border-white/70 bg-white/78 text-gray-700 shadow-[0_18px_36px_-28px_rgba(192,132,252,0.85)] backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:bg-white/92 dark:border-white/10 dark:bg-[#171022]/80 dark:text-gray-100 dark:hover:border-amber-200/30 dark:hover:bg-[#1d1630]/88 focus-ring"
    >
      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute inset-0 rounded-[1.15rem] opacity-70 transition duration-300',
          resolvedTheme === 'light'
            ? 'bg-[radial-gradient(circle_at_35%_30%,rgba(253,224,71,0.45),transparent_38%)]'
            : 'bg-[radial-gradient(circle_at_65%_30%,rgba(196,181,253,0.34),transparent_42%)]',
        )}
      />
      <span className="relative block h-5 w-5">
        <span
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 flex items-center justify-center text-[1.05rem] transition duration-300 ease-out',
            resolvedTheme === 'light'
              ? 'translate-y-0 rotate-0 scale-100 opacity-100'
              : 'translate-y-1 rotate-90 scale-75 opacity-0',
          )}
        >
          ☀️
        </span>
        <span
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 flex items-center justify-center text-[1.05rem] transition duration-300 ease-out',
            resolvedTheme === 'dark'
              ? 'translate-y-0 rotate-0 scale-100 opacity-100'
              : '-translate-y-1 -rotate-90 scale-75 opacity-0',
          )}
        >
          🌙
        </span>
      </span>
    </button>
  );
}
