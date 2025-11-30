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
        className="w-full sm:w-auto flex-1 rounded-md border border-purple-200/70 bg-white/90 px-3 py-2 text-sm shadow-sm shadow-purple-100 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200/70 dark:border-purple-500/40 dark:bg-[#0f172a] dark:text-gray-100 dark:shadow-purple-900/30 dark:focus:border-purple-300 dark:focus:ring-purple-500/30"
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
