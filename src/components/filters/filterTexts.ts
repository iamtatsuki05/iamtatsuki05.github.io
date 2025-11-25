export type FilterTextKey = 'search' | 'latest' | 'allPosts' | 'noResult' | 'year' | 'tags' | 'clear' | 'types';

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
};

export function resolveFilterText(locale: 'ja' | 'en'): FilterTextDict {
  return locale === 'ja' ? filterTextJa : filterTextEn;
}
