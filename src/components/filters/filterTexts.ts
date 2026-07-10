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
  | 'sortNewest'
  | 'voiceStart'
  | 'voiceStop';

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
  voiceStart: '音声で検索',
  voiceStop: '音声入力を停止',
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
  voiceStart: 'Search by voice',
  voiceStop: 'Stop voice input',
};

export const filterTextZh: FilterTextDict = {
  search: '搜索...',
  latest: '✨ 最新',
  allPosts: '🗂 所有文章',
  noResult: '没有找到匹配项',
  year: '年份',
  tags: '标签',
  clear: '清除',
  types: '类型',
  all: '全部',
  searching: '搜索中...',
  searchKeyword: '搜索',
  sort: '排序',
  sortRelevant: '相关度',
  sortNewest: '最新',
  voiceStart: '语音搜索',
  voiceStop: '停止语音输入',
};

export const filterTextFr: FilterTextDict = {
  search: 'Rechercher...',
  latest: '✨ Récents',
  allPosts: '🗂 Tous les articles',
  noResult: 'Aucun élément trouvé',
  year: 'Année',
  tags: 'Tags',
  clear: 'Effacer',
  types: 'Types',
  all: 'Tout',
  searching: 'Recherche...',
  searchKeyword: 'Recherche',
  sort: 'Tri',
  sortRelevant: 'Pertinence',
  sortNewest: 'Plus récent',
  voiceStart: 'Recherche vocale',
  voiceStop: 'Arrêter la saisie vocale',
};

export function resolveFilterText(locale: Locale): FilterTextDict {
  return {
    ja: filterTextJa,
    en: filterTextEn,
    zh: filterTextZh,
    fr: filterTextFr,
  }[locale];
}

export function formatFilterResultCount(locale: Locale, shown: number, total: number) {
  if (locale === 'ja') {
    return shown === total ? `${total}件` : `${total}件中${shown}件`;
  }
  if (locale === 'zh') {
    return shown === total ? `${total}项` : `共 ${total} 项，显示 ${shown} 项`;
  }
  if (locale === 'fr') {
    return shown === total ? `${total} éléments` : `${shown} sur ${total} éléments`;
  }

  return shown === total ? `${total} items` : `${shown} of ${total} items`;
}

export function formatSearchChipLabel(locale: Locale, query: string) {
  return `${resolveFilterText(locale).searchKeyword}: ${query}`;
}

export function formatRemoveFilterAriaLabel(locale: Locale, label: string) {
  if (locale === 'ja') return `${label}を解除`;
  if (locale === 'zh') return `移除${label}`;
  if (locale === 'fr') return `Retirer ${label}`;
  return `Remove ${label}`;
}

export function formatClearFilterLabel(locale: Locale, label: string) {
  if (locale === 'ja') return `${label}をクリア`;
  if (locale === 'zh') return `清除${label}`;
  if (locale === 'fr') return `Effacer ${label}`;
  return `Clear ${label}`;
}

export function formatNoResultMessage(locale: Locale, query?: string) {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) {
    return resolveFilterText(locale).noResult;
  }

  if (locale === 'ja') return `「${trimmedQuery}」に一致する項目がありません`;
  if (locale === 'zh') return `没有找到与“${trimmedQuery}”匹配的项目`;
  if (locale === 'fr') return `Aucun élément trouvé pour "${trimmedQuery}"`;
  return `No items found for "${trimmedQuery}"`;
}
