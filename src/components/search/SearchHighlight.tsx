import React, { Fragment, useMemo } from 'react';
import { tokenizeSearchQuery } from '@/lib/search/queryTokens';

type Props = {
  text: string;
  query: string;
  className?: string;
};

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function SearchHighlight({ text, query, className = 'search-highlight' }: Props) {
  const parts = useMemo(() => {
    const tokens = Array.from(new Set(tokenizeSearchQuery(query))).sort((a, b) => b.length - a.length);
    if (!text || tokens.length === 0) return null;

    const normalizedTokens = new Set(tokens);
    const pattern = new RegExp(`(${tokens.map(escapeForRegExp).join('|')})`, 'gi');

    return text
      .split(pattern)
      .filter(Boolean)
      .map((part) => ({
        value: part,
        highlighted: normalizedTokens.has(part.toLocaleLowerCase()),
      }));
  }, [query, text]);

  if (!parts) return text;

  return (
    <>
      {parts.map((part, index) =>
        part.highlighted ? (
          <mark key={`${part.value}-${index}`} className={className}>
            {part.value}
          </mark>
        ) : (
          <Fragment key={`${part.value}-${index}`}>{part.value}</Fragment>
        ),
      )}
    </>
  );
}
