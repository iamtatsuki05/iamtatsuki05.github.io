'use client';

import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { RouteStatusShell } from '@/components/site/RouteStatusShell';
import {
  routeStatusPrimaryActionClass,
  routeStatusSecondaryActionClass,
} from '@/components/site/routeStatusStyles';

export default function Error({
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
    <RouteStatusShell
      code="500 ERROR"
      title="エラーが発生しました"
      description="予期しない問題が発生しました。再試行しても解決しない場合は、時間をおいてアクセスしてください。"
      detail="An unexpected error occurred. Please try again in a moment."
      actions={
        <>
          <button type="button" onClick={() => reset()} className={routeStatusPrimaryActionClass}>
            再試行する
          </button>
          <Link href="/" className={routeStatusSecondaryActionClass}>
            ホームへ戻る
          </Link>
        </>
      }
    />
  );
}
