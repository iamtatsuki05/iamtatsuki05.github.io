export type UiLocale = 'ja' | 'en';

export function formatDate(dateLike: string, locale: UiLocale = 'ja') {
  // 安定化: 常にUTC基準で日付部分のみを使用
  let d = new Date(dateLike);
  if (isNaN(d.getTime())) {
    // フォールバック: 先頭10文字
    const s = (dateLike || '').toString().slice(0, 10);
    return s;
  }
  const y = d.getUTCFullYear();
  const m = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = d.getUTCDate().toString().padStart(2, '0');
  // 表記はロケールで簡易分岐（必要なら拡張）
  return locale === 'ja' ? `${y}/${m}/${day}` : `${y}-${m}-${day}`;
}

