import React, { useEffect, useRef } from 'react';

export type FilterBarActiveFilter = {
  key: string;
  label: string;
  onRemove: () => void;
  ariaLabel?: string;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  placeholder: string;
  onClear?: () => void;
  children?: React.ReactNode;
  className?: string;
  clearLabel?: string;
  hasActiveFilters?: boolean;
  isSearchLoading?: boolean;
  searchLoadingLabel?: string;
  resultLabel?: string;
  activeFilters?: FilterBarActiveFilter[];
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
  isSearchLoading = false,
  searchLoadingLabel = 'Searching...',
  resultLabel,
  activeFilters = [],
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const showClear = Boolean(hasActiveFilters) || Boolean(query);
  const showMeta = Boolean(resultLabel) || activeFilters.length > 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target;
      if (target instanceof HTMLElement) {
        const isFormField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
        if (target.isContentEditable || isFormField || target.closest('[contenteditable="true"]')) return;
      }

      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div data-filter-bar-root="true" className={`filter-bar space-y-3 ${className || ''}`}>
      <div className="filter-bar__controls flex flex-wrap items-center gap-3">
        <div className="filter-bar__search">
          <input
            ref={inputRef}
            aria-label={placeholder}
            aria-keyshortcuts="/"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                onQueryChange('');
              }
            }}
            placeholder={placeholder}
            className="filter-bar__search-input w-full rounded-md border border-purple-200/70 bg-white/90 px-3 py-2 pr-24 text-sm shadow-sm shadow-purple-100 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200/70 dark:border-purple-500/40 dark:bg-[#0f172a] dark:text-gray-100 dark:shadow-purple-900/30 dark:focus:border-purple-300 dark:focus:ring-purple-500/30"
          />
          {isSearchLoading ? (
            <span className="filter-bar__search-status" role="status" aria-live="polite">
              {searchLoadingLabel}
            </span>
          ) : null}
        </div>

        {children}

        {showClear && onClear ? (
          <button type="button" onClick={onClear} className="text-sm underline ml-auto">
            {clearLabel}
          </button>
        ) : null}
      </div>

      {showMeta ? (
        <div className="filter-bar__meta">
          {resultLabel ? (
            <p className="filter-bar__result" data-testid="filter-result-summary" aria-live="polite">
              {resultLabel}
            </p>
          ) : (
            <span />
          )}

          {activeFilters.length ? (
            <div className="filter-bar__chips">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={filter.onRemove}
                  aria-label={filter.ariaLabel || filter.label}
                  className="filter-bar__chip"
                  data-testid="filter-active-chip"
                >
                  <span className="filter-bar__chip-label">{filter.label}</span>
                  <span aria-hidden={true} className="filter-bar__chip-remove">
                    ×
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
