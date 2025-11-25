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
  const [year, setYear] = useState('');
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
        setYear('');
        setTagSet(new Set());
      }}
      hasActiveFilters={Boolean(year || tagSet.size)}
    >
      <YearSelect years={years} value={year} onChange={setYear} label="Year" />
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
