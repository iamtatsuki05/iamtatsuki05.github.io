import type { Locale } from '@/lib/i18n';

export type FilterTextKey =
  | 'search'
  | 'latest'
  | 'allPosts'
  | 'noResult'
  | 'year'
  | 'tags'
  | 'clear'
  | 'types'
  | 'all'
  | 'searching'
  | 'searchKeyword';

export type FilterTextDict = Record<FilterTextKey, string>;

export const filterTextJa: FilterTextDict = {
  search: '検索...',
  latest: '✨ 最新',
  allPosts: '🗂 すべての記事',
  noResult: '該当する項目がありません',
  year: '年',
  tags: 'タグ',
  clear: 'クリア',
  types: '種類',
  all: 'すべて',
  searching: '検索中...',
  searchKeyword: '検索',
};

export const filterTextEn: FilterTextDict = {
  search: 'Search...',
  latest: '✨ Latest',
  allPosts: '🗂 All Posts',
  noResult: 'No items found',
  year: 'Year',
  tags: 'Tags',
  clear: 'Clear',
  types: 'Types',
  all: 'All',
  searching: 'Searching...',
  searchKeyword: 'Search',
};

export function resolveFilterText(locale: 'ja' | 'en'): FilterTextDict {
  return locale === 'ja' ? filterTextJa : filterTextEn;
}

export function formatFilterResultCount(locale: Locale, shown: number, total: number) {
  if (locale === 'ja') {
    return shown === total ? `${total}件` : `${total}件中${shown}件`;
  }

  return shown === total ? `${total} items` : `${shown} of ${total} items`;
}

export function formatSearchChipLabel(locale: Locale, query: string) {
  return `${resolveFilterText(locale).searchKeyword}: ${query}`;
}

export function formatRemoveFilterAriaLabel(locale: Locale, label: string) {
  return locale === 'ja' ? `${label}を解除` : `Remove ${label}`;
}
