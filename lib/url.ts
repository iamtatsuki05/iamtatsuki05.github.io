// BASE_PATH を常に先頭スラッシュ付き・末尾なしに正規化する
// 例: 'repo' -> '/repo', '/repo/' -> '/repo', '' | '/' -> ''
function normalizeBasePath(input?: string | null): string {
  const raw = (input ?? '').trim();
  if (!raw || raw === '/') return '';
  const stripped = raw.replace(/^\/+|\/+$/g, '');
  return `/${stripped}`;
}

export const BASE_PATH = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
export const ASSET_VERSION = (process.env.NEXT_PUBLIC_ASSET_VERSION || '').slice(0, 8);

export function withBasePath(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  if (src.startsWith('/')) {
    // 二重付与を回避（例: BASE_PATH='/repo' かつ src が '/repo/...' のとき）
    if (BASE_PATH && src.startsWith(`${BASE_PATH}/`)) return src;
    return `${BASE_PATH}${src}`;
  }
  // 先頭スラッシュがない相対パスも必ず絶対パスにする
  return `${BASE_PATH}/${src}`.replace(/\/+/g, '/');
}

export function withVersion(src?: string | null): string | undefined {
  if (!src) return undefined;
  if (!ASSET_VERSION) return src || undefined;
  const hasQuery = src.includes('?');
  const sep = hasQuery ? '&' : '?';
  return `${src}${sep}v=${ASSET_VERSION}`;
}
