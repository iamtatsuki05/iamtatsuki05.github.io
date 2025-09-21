import { getAssetVersion, getBasePath } from '@/lib/config/env';

export const BASE_PATH = getBasePath();
export const ASSET_VERSION = getAssetVersion();

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
