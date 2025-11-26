"use client";

import { useEffect, useState } from 'react';

const SLOW_TYPES = new Set(['slow-2g', '2g', '3g']);

/**
 * 接続状況に応じて Next.js の Link prefetch を抑制する判定を返す。
 * Data Saver や低速回線では prefetch を無効にして無駄なデータ転送を減らす。
 */
export function usePrefetchPreference(defaultValue = true) {
  const [shouldPrefetch, setShouldPrefetch] = useState(defaultValue);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const conn = (navigator as any).connection;
    if (!conn) return;

    const compute = () => {
      if (conn.saveData) return false;
      if (SLOW_TYPES.has(conn.effectiveType)) return false;
      return true;
    };

    setShouldPrefetch(compute());

    const onChange = () => setShouldPrefetch(compute());
    conn.addEventListener?.('change', onChange);
    return () => conn.removeEventListener?.('change', onChange);
  }, [defaultValue]);

  return shouldPrefetch;
}
