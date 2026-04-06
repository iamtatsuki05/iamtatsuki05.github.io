import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterBar } from '@/components/filters/FilterBar';

describe('FilterBar', () => {
  it('focuses the search input when slash is pressed outside editable fields', () => {
    render(
      <div>
        <button type="button">Other</button>
        <FilterBar query="" onQueryChange={() => {}} placeholder="Search..." />
      </div>,
    );

    const input = screen.getByRole('textbox', { name: 'Search...' });
    fireEvent.keyDown(window, { key: '/' });

    expect(input).toHaveFocus();
  });

  it('does not steal focus from another editable field when slash is pressed there', () => {
    render(
      <div>
        <input aria-label="Other input" />
        <FilterBar query="" onQueryChange={() => {}} placeholder="Search..." />
      </div>,
    );

    const otherInput = screen.getByRole('textbox', { name: 'Other input' });
    const searchInput = screen.getByRole('textbox', { name: 'Search...' });
    otherInput.focus();
    fireEvent.keyDown(otherInput, { key: '/' });

    expect(otherInput).toHaveFocus();
    expect(searchInput).not.toHaveFocus();
  });

  it('clears the query when Escape is pressed inside the search input', () => {
    const onQueryChange = vi.fn();
    render(<FilterBar query="hello" onQueryChange={onQueryChange} placeholder="Search..." />);

    const input = screen.getByRole('textbox', { name: 'Search...' });
    input.focus();
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('notifies search intent on focus and pointer enter', () => {
    const onSearchIntent = vi.fn();
    render(<FilterBar query="" onQueryChange={() => {}} onSearchIntent={onSearchIntent} placeholder="Search..." />);

    const input = screen.getByRole('textbox', { name: 'Search...' });
    fireEvent.focus(input);
    fireEvent.pointerEnter(input);

    expect(onSearchIntent).toHaveBeenCalledTimes(2);
  });

  it('renders sticky mobile meta and sort controls when provided', () => {
    const { container } = render(
      <FilterBar
        query="enc"
        onQueryChange={() => {}}
        placeholder="Search..."
        resultLabel="1 of 3 items"
        stickyMetaOnMobile
        sortControls={<button type="button">Relevant</button>}
      />,
    );

    expect(screen.getByRole('button', { name: 'Relevant' })).toBeInTheDocument();
    expect(container.querySelector('.filter-bar__meta')).toHaveClass('filter-bar__meta--sticky-mobile');
  });
});
