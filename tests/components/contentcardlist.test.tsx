import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContentCardList } from '@/components/home/sections/ContentCardList';

describe('ContentCardList', () => {
  const items = [
    { key: 'internal', title: 'Internal', description: 'Desc', href: '/blogs/test', date: '2024-01-01' },
    { key: 'external', title: 'External', description: 'Desc', href: 'https://example.com', external: true, date: '2024-02-02' },
    { key: 'plain', title: 'Plain', description: 'Desc' },
  ];

  it('renders internal, external, and plain cards with correct links', () => {
    render(<ContentCardList items={items} listTestId="list" cardTestId="card" />);

    const internal = screen.getByText('Internal').closest('a');
    expect(internal).toHaveAttribute('href', '/blogs/test');
    expect(internal?.getAttribute('target')).toBeNull();

    const external = screen.getByText('External').closest('a');
    expect(external).toHaveAttribute('href', 'https://example.com');
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noreferrer');

    const plain = screen.getByText('Plain').closest('div');
    expect(plain?.tagName.toLowerCase()).toBe('div');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('reveals cards after the initial enter delay', () => {
    vi.useFakeTimers();

    render(<ContentCardList items={items} listTestId="list" cardTestId="card" />);

    const list = screen.getByTestId('list');
    expect(list).toHaveAttribute('data-state', 'hidden');

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(list).toHaveAttribute('data-state', 'open');
  });
});
