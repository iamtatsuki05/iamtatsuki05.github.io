import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FilterBar } from './FilterBar';
import { YearSelect } from './YearSelect';
import { TagSelector } from './TagSelector';
import {
  buildBaseActiveFilters,
  removeSetValue,
  SearchSortControls,
  toggleSetValue,
} from './filterHelpers';

const meta = {
  title: 'Filters/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'padded',
  },
  render: (args) => <FilterBarStory {...args} />,
  args: {
    placeholder: 'Search...',
    clearLabel: 'Clear',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterBar>;

function FilterBarStory(props: React.ComponentProps<typeof FilterBar>) {
  const [query, setQuery] = useState('');
  const [yearSet, setYearSet] = useState<Set<string>>(new Set());
  const [tagSet, setTagSet] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<'relevant' | 'newest'>('relevant');
  const tags = ['nlp', 'ml', 'dev'];
  const years = ['2025', '2024', '2023'];

  return (
    <FilterBar
      {...props}
      query={query}
      onQueryChange={setQuery}
      onClear={() => {
        setQuery('');
        setYearSet(new Set());
        setTagSet(new Set());
      }}
      hasActiveFilters={Boolean(yearSet.size || tagSet.size)}
      searchLoadingLabel="Searching..."
      resultLabel={query || yearSet.size || tagSet.size ? '3 of 12 items' : '12 items'}
      stickyMetaOnMobile
      sortControls={(
        <SearchSortControls
          visible={Boolean(query)}
          sort={sort}
          onSortChange={setSort}
          texts={{
            sort: 'Sort',
            sortRelevant: 'Relevant',
            sortNewest: 'Newest',
          }}
        />
      )}
      activeFilters={buildBaseActiveFilters({
        locale: 'en',
        query,
        yearSet,
        tagSet,
        onQueryClear: () => setQuery(''),
        onYearRemove: (year) => setYearSet((prev) => removeSetValue(new Set(prev), year)),
        onTagRemove: (tag) => setTagSet((prev) => removeSetValue(new Set(prev), tag)),
      })}
    >
      <YearSelect
        years={years}
        selected={yearSet}
        onToggle={(year) => setYearSet((prev) => toggleSetValue(new Set(prev), year))}
        onClear={() => setYearSet(new Set())}
        label="Year"
        allLabel="All"
      />
      <TagSelector
        tags={tags}
        selected={tagSet}
        onToggle={(tag) => setTagSet((prev) => toggleSetValue(new Set(prev), tag))}
        label="Tags"
      />
    </FilterBar>
  );
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    placeholder: 'Search...',
    clearLabel: 'Clear',
  },
};

export const Mobile: Story = {
  args: {
    query: '',
    onQueryChange: () => {},
    placeholder: 'Search...',
    clearLabel: 'Clear',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
