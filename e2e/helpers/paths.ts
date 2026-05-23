export function localizedPath(locale: 'ja' | 'en' | 'zh' | 'fr', path: string = '/'): string {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const localeSegment = {
    ja: 'ja-JP',
    en: 'en-US',
    zh: 'zh-CN',
    fr: 'fr-FR',
  }[locale];
  const lower = normalized.toLowerCase();
  if (
    lower === '/'
    || lower === '/ja/'
    || lower === '/en/'
    || lower === '/zh/'
    || lower === '/fr/'
    || lower === '/ja-jp/'
    || lower === '/en-us/'
    || lower === '/zh-cn/'
    || lower === '/fr-fr/'
  ) {
    return `/${localeSegment}/`;
  }
  const withSlash = normalized.startsWith('/') ? normalized : `/${normalized}`;
  return `/${localeSegment}${withSlash}`.replace(/\/+/g, '/');
}
