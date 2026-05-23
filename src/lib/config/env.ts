const DEFAULT_PRODUCTION_SITE_URL = 'https://iamtatsuki05.com';
const DEFAULT_DEVELOPMENT_SITE_URL = 'http://localhost:3000';
const DAY_MS = 24 * 60 * 60 * 1000;

function normalize(input?: string | null) {
  return typeof input === 'string' ? input.trim() : undefined;
}

function readEnv(name: string): string | undefined {
  if (typeof process !== 'undefined' && process.env?.[name] !== undefined) {
    return process.env[name];
  }
  const metaEnv = import.meta.env as Record<string, string | undefined> | undefined;
  return metaEnv?.[name] ?? metaEnv?.[`PUBLIC_${name}`];
}

export function normalizeBasePath(input?: string | null): string {
  const raw = normalize(input);
  if (!raw || raw === '/') return '';
  const stripped = raw.replace(/^\/+|\/+$/g, '');
  return stripped ? `/${stripped}` : '';
}

export function getBasePath(): string {
  return normalizeBasePath(readEnv('NEXT_PUBLIC_BASE_PATH') || readEnv('PUBLIC_BASE_PATH'));
}

export function getAssetVersion(): string {
  const raw = normalize(readEnv('NEXT_PUBLIC_ASSET_VERSION') || readEnv('PUBLIC_ASSET_VERSION')) || '';
  return raw.slice(0, 8);
}

export function getGoogleAnalyticsId(): string | undefined {
  return normalize(readEnv('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID') || readEnv('PUBLIC_GOOGLE_ANALYTICS_ID')) || undefined;
}

export function getNodeEnv(): 'development' | 'production' | 'test' {
  const raw = normalize(readEnv('NODE_ENV') || import.meta.env.MODE);
  if (raw === 'development' || raw === 'test') return raw;
  return 'production';
}

export function isDevelopment(): boolean {
  return getNodeEnv() === 'development';
}

export function getSiteUrl(): string {
  const prefer = normalize(readEnv('SITE_URL')) || normalize(readEnv('NEXT_PUBLIC_SITE_URL') || readEnv('PUBLIC_SITE_URL'));
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
  return normalize(readEnv('INCLUDE_DRAFTS'))?.toLowerCase() === 'true';
}

export function shouldDisableOgFetch(): boolean {
  return normalize(readEnv('OG_DISABLE_FETCH'))?.toLowerCase() === 'true';
}

export function getOgCacheTtlMs(defaultTtl: number = 7 * DAY_MS): number {
  const raw = normalize(readEnv('OG_CACHE_TTL_MS'));
  if (!raw) return defaultTtl;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return defaultTtl;
  return parsed;
}

export const DEFAULT_SITE_URL = DEFAULT_PRODUCTION_SITE_URL;
export const DEFAULT_DEV_SITE_URL = DEFAULT_DEVELOPMENT_SITE_URL;
