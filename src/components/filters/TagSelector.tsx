import React from 'react';

type Props = {
  tags: string[];
  selected: Set<string>;
  onToggle: (tag: string) => void;
  label: string;
  className?: string;
};

export function TagSelector({ tags, selected, onToggle, label, className }: Props) {
  return (
    <details className={className}>
      <summary className="cursor-pointer select-none text-sm opacity-80">
        {label} ({tags.length})
      </summary>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selected.has(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              className={`px-2 py-0.5 rounded-sm text-sm border ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </details>
  );
}
