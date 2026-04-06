import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SearchHighlight } from '@/components/search/SearchHighlight';

describe('SearchHighlight', () => {
  it('highlights matching query tokens case-insensitively', () => {
    render(
      <p>
        <SearchHighlight text="Sample 11 Hello" query="sample hello" />
      </p>,
    );

    const marks = screen.getAllByText(/sample|hello/i, { selector: 'mark.search-highlight' });
    expect(marks).toHaveLength(2);
    expect(marks[0]).toHaveTextContent('Sample');
    expect(marks[1]).toHaveTextContent('Hello');
  });

  it('highlights normalized query tokens from full-width and hyphenated input', () => {
    render(
      <p>
        <SearchHighlight text="Sample 11 Hello" query="Ｓａｍｐｌｅ－１１" />
      </p>,
    );

    const marks = screen.getAllByText(/Sample|11/, { selector: 'mark.search-highlight' });
    expect(marks).toHaveLength(2);
    expect(marks[0]).toHaveTextContent('Sample');
    expect(marks[1]).toHaveTextContent('11');
  });

  it('returns plain text when the query is empty', () => {
    render(
      <p>
        <SearchHighlight text="Sample 11" query="" />
      </p>,
    );

    expect(screen.queryByText('Sample 11', { selector: 'mark.search-highlight' })).toBeNull();
    expect(screen.getByText('Sample 11')).toBeInTheDocument();
  });
});
