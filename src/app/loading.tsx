import React from 'react';

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center py-10">
      <div className="relative overflow-hidden rounded-3xl border border-purple-200/70 bg-white/85 px-8 py-10 text-center shadow-[0_20px_70px_-40px_rgba(192,132,252,0.75)] backdrop-blur-sm dark:border-purple-500/40 dark:bg-[#120d21]/90">
        <div className="pointer-events-none absolute -left-10 -top-14 h-40 w-40 rounded-full bg-purple-300/35 blur-3xl dark:bg-purple-500/25" />
        <div className="pointer-events-none absolute -bottom-14 -right-6 h-40 w-40 rounded-full bg-amber-200/45 blur-3xl dark:bg-amber-300/20" />

        <div className="relative space-y-4">
          <div
            className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-purple-200 border-t-purple-500"
            aria-label="ページを読み込み中"
          />
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">ページを読み込んでいます…</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading content…</p>
        </div>
      </div>
    </div>
  );
}
