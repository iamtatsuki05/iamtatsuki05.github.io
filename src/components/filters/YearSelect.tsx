import React from 'react';
import { FilterDisclosure } from './FilterDisclosure';

type Props = {
  years: string[];
  selected: Set<string>;
  onToggle: (year: string) => void;
  onClear: () => void;
  label: string;
  allLabel?: string;
  className?: string;
};

export function YearSelect({ years, selected, onToggle, onClear, label, allLabel = 'All', className }: Props) {
  return (
    <FilterDisclosure
      label={label}
      count={years.length}
      selectedCount={selected.size}
      className={className}
      autoCloseOnSelect="mobile"
    >
      {({ requestCloseIfNeeded }) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              requestCloseIfNeeded();
              onClear();
            }}
            aria-pressed={selected.size === 0}
            className={`rounded-full border px-2.5 py-1 text-sm transition ${
              selected.size === 0
                ? 'border-purple-300 bg-purple-100/85 text-purple-900 dark:border-purple-400/40 dark:bg-[#21163a] dark:text-purple-100'
                : 'border-gray-200 bg-white/80 text-gray-700 hover:border-purple-200 hover:bg-purple-50 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:border-amber-300/30 dark:hover:bg-[#1a2439]'
            }`}
          >
            {allLabel}
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => {
                requestCloseIfNeeded();
                onToggle(year);
              }}
              aria-pressed={selected.has(year)}
              className={`rounded-full border px-2.5 py-1 text-sm transition ${
                selected.has(year)
                  ? 'border-purple-300 bg-purple-100/85 text-purple-900 dark:border-purple-400/40 dark:bg-[#21163a] dark:text-purple-100'
                  : 'border-gray-200 bg-white/80 text-gray-700 hover:border-purple-200 hover:bg-purple-50 dark:border-gray-700 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:border-amber-300/30 dark:hover:bg-[#1a2439]'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      )}
    </FilterDisclosure>
  );
}
