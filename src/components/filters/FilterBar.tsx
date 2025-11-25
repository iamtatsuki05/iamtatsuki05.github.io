import React from 'react';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  onClear?: () => void;
  children?: React.ReactNode;
  className?: string;
  clearLabel?: string;
  hasActiveFilters?: boolean;
};

export function FilterBar({
  query,
  onQueryChange,
  placeholder,
  onClear,
  children,
  className,
  clearLabel = 'Clear',
  hasActiveFilters,
}: Props) {
  const showClear = Boolean(hasActiveFilters) || Boolean(query);

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className || ''}`}>
      <input
        aria-label={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full sm:w-auto flex-1 border rounded-sm px-3 py-2 dark:border-gray-700"
      />

      {children}

      {showClear && onClear ? (
        <button onClick={onClear} className="text-sm underline ml-auto">
          {clearLabel}
        </button>
      ) : null}
    </div>
  );
}
