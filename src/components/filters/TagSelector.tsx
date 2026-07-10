
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
    <FilterDisclosure
      label={label}
      count={tags.length}
      selectedCount={selected.size}
      className={className}
      panelClassName="max-h-56 overflow-y-auto"
      autoCloseOnSelect="mobile"
    >
      {({ requestCloseIfNeeded }) => (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = selected.has(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => {
                  requestCloseIfNeeded();
                  onToggle(tag);
                }}
                aria-pressed={active}
                aria-label={`Filter by ${tag} tag`}
                className={`min-h-7 rounded-sm border px-2.5 py-1 text-sm ${active ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </FilterDisclosure>
  );
}
