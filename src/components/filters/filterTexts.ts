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
  | 'searchKeyword'
  | 'sort'
  | 'sortRelevant'
  | 'sortNewest';

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
  sort: '並び替え',
  sortRelevant: '関連順',
  sortNewest: '新しい順',
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
  sort: 'Sort',
  sortRelevant: 'Relevant',
  sortNewest: 'Newest',
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

export function formatClearFilterLabel(locale: Locale, label: string) {
  return locale === 'ja' ? `${label}をクリア` : `Clear ${label}`;
}

export function formatNoResultMessage(locale: Locale, query?: string) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) {
    return resolveFilterText(locale).noResult;
  }

  return locale === 'ja'
    ? `「${trimmedQuery}」に一致する項目がありません`
    : `No items found for "${trimmedQuery}"`;
}
