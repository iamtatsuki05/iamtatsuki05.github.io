import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from './FilterBar';
import { YearSelect } from './YearSelect';
import { TagSelector } from './TagSelector';
import React, { useState } from 'react';

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
      activeFilters={[
        ...(query ? [{ key: 'query', label: `Search: ${query}`, onRemove: () => setQuery('') }] : []),
        ...Array.from(yearSet).map((year) => ({ key: `year:${year}`, label: year, onRemove: () => {
          const next = new Set(yearSet);
          next.delete(year);
          setYearSet(next);
        } })),
        ...Array.from(tagSet).map((tag) => ({ key: `tag:${tag}`, label: `#${tag}`, onRemove: () => {
          const next = new Set(tagSet);
          next.delete(tag);
          setTagSet(next);
        } })),
      ]}
    >
      <YearSelect
        years={years}
        selected={yearSet}
        onToggle={(year) => {
          const next = new Set(yearSet);
          if (next.has(year)) next.delete(year);
          else next.add(year);
          setYearSet(next);
        }}
        onClear={() => setYearSet(new Set())}
        label="Year"
        allLabel="All"
      />
      <TagSelector
        tags={tags}
        selected={tagSet}
        onToggle={(tag) => {
          const next = new Set(tagSet);
          if (next.has(tag)) next.delete(tag);
          else next.add(tag);
          setTagSet(next);
        }}
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
