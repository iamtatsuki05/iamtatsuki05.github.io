import { useEffect, useRef } from 'react';
import type React from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export type FilterBarActiveFilter = {
  key: string;
  label: string;
  onRemove: () => void;
  ariaLabel?: string;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearchIntent?: () => void;
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
  sortControls?: React.ReactNode;
  stickyMetaOnMobile?: boolean;
  /** 音声入力の認識言語 (例: 'ja-JP')。未指定ならマイクボタンを表示しない。 */
  voiceLang?: string;
  voiceStartLabel?: string;
  voiceStopLabel?: string;
};

export function FilterBar({
  query,
  onQueryChange,
  onSearchIntent,
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
  sortControls,
  stickyMetaOnMobile = false,
  voiceLang,
  voiceStartLabel = 'Search by voice',
  voiceStopLabel = 'Stop voice input',
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const showClear = Boolean(hasActiveFilters) || Boolean(query);
  const showMeta = Boolean(resultLabel) || activeFilters.length > 0 || Boolean(sortControls);

  const {
    supported: voiceSupported,
    listening: voiceListening,
    toggle: toggleVoice,
  } = useSpeechRecognition({
    lang: voiceLang ?? 'en-US',
    onResult: (transcript) => {
      onQueryChange(transcript);
    },
  });
  const showVoiceButton = Boolean(voiceLang) && voiceSupported;

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
        <div className={`filter-bar__search ${showVoiceButton ? 'filter-bar__search--voice' : ''}`}>
          <input
            ref={inputRef}
            aria-label={placeholder}
            aria-keyshortcuts="/"
            value={query}
            onFocus={() => {
              onSearchIntent?.();
            }}
            onPointerEnter={() => {
              onSearchIntent?.();
            }}
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
          {showVoiceButton ? (
            <button
              type="button"
              onClick={() => {
                onSearchIntent?.();
                toggleVoice();
              }}
              aria-label={voiceListening ? voiceStopLabel : voiceStartLabel}
              aria-pressed={voiceListening}
              data-state={voiceListening ? 'listening' : 'idle'}
              data-testid="filter-voice-button"
              className="filter-bar__voice focus-ring"
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="18" x2="12" y2="22" />
              </svg>
            </button>
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
        <div className={`filter-bar__meta ${stickyMetaOnMobile ? 'filter-bar__meta--sticky-mobile' : ''}`}>
          <div className="filter-bar__meta-primary">
            {resultLabel ? (
              <p className="filter-bar__result" data-testid="filter-result-summary" aria-live="polite">
                {resultLabel}
              </p>
            ) : null}
            {sortControls ? sortControls : null}
          </div>

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
