'use client';

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { RouteStatusShell } from '@/components/site/RouteStatusShell';
import {
  routeStatusPrimaryActionClass,
  routeStatusSecondaryActionClass,
} from '@/components/site/routeStatusStyles';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-[#fdf8f3] via-[#fbf7ff] to-[#fffaf0] text-gray-900">
        <main className="container mx-auto max-w-screen-2xl px-4 py-8">
          <RouteStatusShell
            code="GLOBAL ERROR"
            title="システムエラーが発生しました"
            description="サイト全体で問題が発生しています。復旧するまでしばらくお待ちください。"
            detail="A global error occurred. Please try again shortly."
            actions={
              <>
                <button type="button" onClick={() => reset()} className={routeStatusPrimaryActionClass}>
                  再読み込みする
                </button>
                <Link href="/" className={routeStatusSecondaryActionClass}>
                  ホームへ戻る
                </Link>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
