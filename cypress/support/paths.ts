export function localizedPath(locale: 'ja' | 'en', path: string = '/'): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  if (normalized === '/' || normalized === '/ja/' || normalized === '/en/') {
    return locale === 'ja' ? '/ja/' : '/en/';
  }
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `/${locale}${withSlash}`.replace(/\\+/g, '/');
}
