export function localizedPath(locale: 'ja' | 'en', path: string = '/'): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const localeSegment = locale === 'ja' ? 'ja-JP' : 'en-US';
  const lower = normalized.toLowerCase();
  if (lower === '/' || lower === '/ja/' || lower === '/en/' || lower === '/ja-jp/' || lower === '/en-us/') {
    return `/${localeSegment}/`;
  }
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `/${localeSegment}${withSlash}`.replace(/\/+/g, '/');
}
