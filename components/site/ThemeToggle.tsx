"use client";
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <span className="inline-block w-7 h-7" aria-hidden />; // SSRと一致させるためプレースホルダ
  }
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="px-2 py-1 rounded-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
