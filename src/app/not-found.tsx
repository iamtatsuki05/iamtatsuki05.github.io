import React from 'react';
import Link from 'next/link';
import { RouteStatusShell } from '@/components/site/RouteStatusShell';
import {
  routeStatusPrimaryActionClass,
  routeStatusSecondaryActionClass,
} from '@/components/site/routeStatusStyles';

export default function NotFound() {
  return (
    <RouteStatusShell
      code="404 NOT FOUND"
      title="ページが見つかりません"
      description="指定されたURLのページは移動したか、公開終了した可能性があります。"
      detail="The page may have moved or is no longer available."
      actions={
        <>
          <Link href="/" className={routeStatusPrimaryActionClass}>
            ホームへ戻る
          </Link>
          <Link href="/blogs/" className={routeStatusSecondaryActionClass}>
            ブログ一覧へ
          </Link>
          <Link href="/links/" className={routeStatusSecondaryActionClass}>
            リンク一覧へ
          </Link>
        </>
      }
    />
  );
}
