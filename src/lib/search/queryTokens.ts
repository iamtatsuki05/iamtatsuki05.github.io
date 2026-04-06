const SEARCH_SEPARATOR_PATTERN = /[\s\u00A0\u2000-\u200B\u2010-\u2015\u2212\u30FC\uFF0D_\-/・]+/g;

export function normalizeSearchText(value: string) {
  return value
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(SEARCH_SEPARATOR_PATTERN, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function tokenizeSearchQuery(query: string) {
  const normalized = normalizeSearchText(query);
  return normalized ? normalized.split(' ') : [];
}
