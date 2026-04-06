import React from 'react';
import type { Locale } from '@/lib/i18n';
import type { SearchSortMode } from '@/hooks/useSearchFilters';
import type { FilterBarActiveFilter } from './FilterBar';
import {
  formatClearFilterLabel,
  formatNoResultMessage,
  formatRemoveFilterAriaLabel,
  formatSearchChipLabel,
  type FilterTextDict,
} from './filterTexts';

export type FilterEmptyAction = {
  key: string;
  label: string;
  onClick: () => void;
};

type BaseActiveFilterOptions = {
  locale: Locale;
  query: string;
  yearSet: Set<string>;
  tagSet: Set<string>;
  onQueryClear: () => void;
  onYearRemove: (year: string) => void;
  onTagRemove: (tag: string) => void;
};

type BaseEmptyStateOptions = {
  locale: Locale;
  query: string;
  hasYears: boolean;
  hasTags: boolean;
  onQueryClear: () => void;
  onYearsClear: () => void;
  onTagsClear: () => void;
  texts: Pick<FilterTextDict, 'searchKeyword' | 'year' | 'tags'>;
};

type SearchSortControlsProps = {
  visible: boolean;
  sort: SearchSortMode;
  onSortChange: (value: SearchSortMode) => void;
  texts: Pick<FilterTextDict, 'sort' | 'sortRelevant' | 'sortNewest'>;
};

export function toggleSetValue<T>(set: Set<T>, value: T) {
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }

  return set;
}

export function removeSetValue<T>(set: Set<T>, value: T) {
  set.delete(value);
  return set;
}

export function buildBaseActiveFilters({
  locale,
  query,
  yearSet,
  tagSet,
  onQueryClear,
  onYearRemove,
  onTagRemove,
}: BaseActiveFilterOptions): FilterBarActiveFilter[] {
  const filters: FilterBarActiveFilter[] = [];

  if (query) {
    const label = formatSearchChipLabel(locale, query);
    filters.push({
      key: `q:${query}`,
      label,
      ariaLabel: formatRemoveFilterAriaLabel(locale, label),
      onRemove: onQueryClear,
    });
  }

  for (const year of Array.from(yearSet).sort((left, right) => (left < right ? 1 : -1))) {
    filters.push({
      key: `year:${year}`,
      label: year,
      ariaLabel: formatRemoveFilterAriaLabel(locale, year),
      onRemove: () => onYearRemove(year),
    });
  }

  for (const tag of Array.from(tagSet).sort()) {
    const label = `#${tag}`;
    filters.push({
      key: `tag:${tag}`,
      label,
      ariaLabel: formatRemoveFilterAriaLabel(locale, label),
      onRemove: () => onTagRemove(tag),
    });
  }

  return filters;
}

export function buildBaseEmptyStateActions({
  locale,
  query,
  hasYears,
  hasTags,
  onQueryClear,
  onYearsClear,
  onTagsClear,
  texts,
}: BaseEmptyStateOptions): FilterEmptyAction[] {
  const actions: FilterEmptyAction[] = [];

  if (query) {
    actions.push({
      key: 'clear-search',
      label: formatClearFilterLabel(locale, texts.searchKeyword),
      onClick: onQueryClear,
    });
  }

  if (hasYears) {
    actions.push({
      key: 'clear-years',
      label: formatClearFilterLabel(locale, texts.year),
      onClick: onYearsClear,
    });
  }

  if (hasTags) {
    actions.push({
      key: 'clear-tags',
      label: formatClearFilterLabel(locale, texts.tags),
      onClick: onTagsClear,
    });
  }

  return actions;
}

export function SearchSortControls({ visible, sort, onSortChange, texts }: SearchSortControlsProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className="filter-bar__sort" role="group" aria-label={texts.sort}>
      <button
        type="button"
        className="filter-bar__sort-button ui-cta"
        aria-pressed={sort === 'relevant'}
        onClick={() => onSortChange('relevant')}
      >
        {texts.sortRelevant}
      </button>
      <button
        type="button"
        className="filter-bar__sort-button ui-cta"
        aria-pressed={sort === 'newest'}
        onClick={() => onSortChange('newest')}
      >
        {texts.sortNewest}
      </button>
    </div>
  );
}

export function FilterEmptyState({
  locale,
  query,
  actions,
}: {
  locale: Locale;
  query: string;
  actions: FilterEmptyAction[];
}) {
  return (
    <div className="search-empty-state space-y-3" data-testid="filter-empty-state">
      <p className="opacity-70">{formatNoResultMessage(locale, query)}</p>
      {actions.length ? (
        <div className="search-empty-actions">
          {actions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={action.onClick}
              className="search-empty-action ui-cta"
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
