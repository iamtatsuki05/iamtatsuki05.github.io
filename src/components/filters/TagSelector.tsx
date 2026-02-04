import React from 'react';
import { FilterDisclosure } from './FilterDisclosure';

type Props = {
  tags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  label: string;
  className?: string;
};

export function TagSelector({ tags, selected, onToggle, label, className }: Props) {
  return (
    <FilterDisclosure label={label} count={tags.length} className={className} panelClassName="max-h-56 overflow-y-auto">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.has(tag);
          return (
            <button
              type="button"
              key={tag}
              onClick={() => onToggle(tag)}
              aria-pressed={active}
              aria-label={`Filter by ${tag} tag`}
              className={`rounded-sm border px-2 py-0.5 text-sm ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </FilterDisclosure>
  );
}
