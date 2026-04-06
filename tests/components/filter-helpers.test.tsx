import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  buildBaseActiveFilters,
  buildBaseEmptyStateActions,
  FilterEmptyState,
  removeSetValue,
  SearchSortControls,
  toggleSetValue,
} from '@/components/filters/filterHelpers';

describe('filterHelpers', () => {
  it('builds base active filters in a stable order and wires removal handlers', () => {
    const onQueryClear = vi.fn();
    const onYearRemove = vi.fn();
    const onTagRemove = vi.fn();

    const filters = buildBaseActiveFilters({
      locale: 'en',
      query: 'encoder',
      yearSet: new Set(['2024', '2025']),
      tagSet: new Set(['zeta', 'alpha']),
      onQueryClear,
      onYearRemove,
      onTagRemove,
    });

    expect(filters.map((filter) => filter.label)).toEqual([
      'Search: encoder',
      '2025',
      '2024',
      '#alpha',
      '#zeta',
    ]);

    filters[0].onRemove();
    filters[1].onRemove();
    filters[4].onRemove();

    expect(onQueryClear).toHaveBeenCalledTimes(1);
    expect(onYearRemove).toHaveBeenCalledWith('2025');
    expect(onTagRemove).toHaveBeenCalledWith('zeta');
  });

  it('builds empty state actions only for active base filters', () => {
    const onQueryClear = vi.fn();
    const onYearsClear = vi.fn();
    const onTagsClear = vi.fn();

    const actions = buildBaseEmptyStateActions({
      locale: 'en',
      query: 'encoder',
      hasYears: true,
      hasTags: false,
      onQueryClear,
      onYearsClear,
      onTagsClear,
      texts: {
        searchKeyword: 'Search',
        year: 'Year',
        tags: 'Tags',
      },
    });

    expect(actions.map((action) => action.label)).toEqual(['Clear Search', 'Clear Year']);

    actions[0].onClick();
    actions[1].onClick();

    expect(onQueryClear).toHaveBeenCalledTimes(1);
    expect(onYearsClear).toHaveBeenCalledTimes(1);
    expect(onTagsClear).not.toHaveBeenCalled();
  });

  it('toggles and removes set values in place', () => {
    const years = new Set(['2025']);

    expect(toggleSetValue(years, '2024')).toBe(years);
    expect(Array.from(years)).toEqual(['2025', '2024']);

    expect(toggleSetValue(years, '2025')).toBe(years);
    expect(Array.from(years)).toEqual(['2024']);

    expect(removeSetValue(years, '2024')).toBe(years);
    expect(Array.from(years)).toEqual([]);
  });

  it('renders sort controls and empty state actions', async () => {
    const onSortChange = vi.fn();
    const onReset = vi.fn();
    const user = userEvent.setup();

    render(
      <>
        <SearchSortControls
          visible
          sort="relevant"
          onSortChange={onSortChange}
          texts={{
            sort: 'Sort',
            sortRelevant: 'Relevant',
            sortNewest: 'Newest',
          }}
        />
        <FilterEmptyState
          locale="en"
          query="encoder"
          actions={[{ key: 'reset-search', label: 'Clear Search', onClick: onReset }]}
        />
      </>,
    );

    await user.click(screen.getByRole('button', { name: 'Newest' }));
    await user.click(screen.getByRole('button', { name: 'Clear Search' }));

    expect(onSortChange).toHaveBeenCalledWith('newest');
    expect(onReset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('filter-empty-state')).toHaveTextContent('No items found for "encoder"');
  });
});
