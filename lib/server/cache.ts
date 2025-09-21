import { getNodeEnv } from '@/lib/config/env';

type CacheEntry<T> = {
  value: Promise<T>;
  expiresAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

function shouldBypassCache() {
  const env = getNodeEnv();
  return env === 'development' || env === 'test';
}

function computeExpiry(ttlMs?: number) {
  if (!ttlMs || !Number.isFinite(ttlMs) || ttlMs <= 0) {
    return Number.POSITIVE_INFINITY;
  }
  return Date.now() + ttlMs;
}

export function clearCache(prefix?: string) {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
}

export function cached<T>(key: string, loader: () => Promise<T>, ttlMs?: number): Promise<T> {
  if (shouldBypassCache()) {
    return loader();
  }

  const entry = store.get(key);
  const now = Date.now();
  if (entry && entry.expiresAt > now) {
    return entry.value as Promise<T>;
  }

  const expiresAt = computeExpiry(ttlMs);
  const valuePromise = loader()
    .then((result) => result)
    .catch((error) => {
      store.delete(key);
      throw error;
    });

  store.set(key, { value: valuePromise, expiresAt });
  return valuePromise;
}
