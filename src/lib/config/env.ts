const DEFAULT_PRODUCTION_SITE_URL = 'https://iamtatsuki05.com';
const DEFAULT_DEVELOPMENT_SITE_URL = 'http://localhost:3000';
const DAY_MS = 24 * 60 * 60 * 1000;

function normalize(input?: string | null) {
  return typeof input === 'string' ? input.trim() : undefined;
}

export function normalizeBasePath(input?: string | null): string {
  const raw = normalize(input);
  if (!raw || raw === '/') return '';
  const stripped = raw.replace(/^\/+|\/+$/g, '');
  return stripped ? `/${stripped}` : '';
}

export function getBasePath(): string {
  return normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
}

export function getAssetVersion(): string {
  const raw = normalize(process.env.NEXT_PUBLIC_ASSET_VERSION) || '';
  return raw.slice(0, 8);
}

export function getNodeEnv(): 'development' | 'production' | 'test' {
  const raw = normalize(process.env.NODE_ENV);
  if (raw === 'development' || raw === 'test') return raw;
  return 'production';
}

export function isDevelopment(): boolean {
  return getNodeEnv() === 'development';
}

export function getSiteUrl(): string {
  const prefer = normalize(process.env.SITE_URL) || normalize(process.env.NEXT_PUBLIC_SITE_URL);
  if (prefer) {
    try {
      const parsed = new URL(prefer);
      const pathname = parsed.pathname.replace(/\/$/, '');
      return `${parsed.origin}${pathname}`;
    } catch {
      // ignore malformed env value
    }
  }
  return isDevelopment() ? DEFAULT_DEVELOPMENT_SITE_URL : DEFAULT_PRODUCTION_SITE_URL;
}

export function getSiteUrlWithBasePath(): string {
  const origin = getSiteUrl().replace(/\/$/, '');
  const basePath = getBasePath();
  if (!basePath) return origin;
  return origin.endsWith(basePath) ? origin : `${origin}${basePath}`;
}

export function shouldIncludeDrafts(): boolean {
  return normalize(process.env.INCLUDE_DRAFTS)?.toLowerCase() === 'true';
}

export function shouldDisableOgFetch(): boolean {
  return normalize(process.env.OG_DISABLE_FETCH)?.toLowerCase() === 'true';
}

export function getOgCacheTtlMs(defaultTtl: number = 7 * DAY_MS): number {
  const raw = normalize(process.env.OG_CACHE_TTL_MS);
  if (!raw) return defaultTtl;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultTtl;
  return parsed;
}

export const DEFAULT_SITE_URL = DEFAULT_PRODUCTION_SITE_URL;
export const DEFAULT_DEV_SITE_URL = DEFAULT_DEVELOPMENT_SITE_URL;
