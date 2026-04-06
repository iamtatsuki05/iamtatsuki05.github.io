import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LinkGrid } from '@/components/links/LinkGrid';

const items = [
  { title: 'GitHub', url: 'https://github.com', desc: 'Code hosting' },
  { title: 'Blog', url: 'https://example.com/blog', desc: 'Posts' },
];

describe('LinkGrid', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders links and reveals the grid after the initial enter delay', () => {
    vi.useFakeTimers();

    const { container } = render(<LinkGrid items={items} showDescription iconSize={40} />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com');
    expect(screen.getByText('Code hosting')).toBeVisible();

    const list = container.querySelector('ul.content-reveal-list');
    if (!list) throw new Error('Link grid list is missing');

    expect(list).toHaveAttribute('data-state', 'hidden');

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(list).toHaveAttribute('data-state', 'open');
  });
});
