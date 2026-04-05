import React from 'react';
import { act, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';

const sample = Array.from({ length: 12 }).map((_, i) => ({
  slug: `post-${i}`,
  title: `Sample ${i}`,
  date: `${i % 2 === 0 ? '2025' : '2024'}-01-${(i + 1).toString().padStart(2, '0')}`,
  tags: i % 2 === 0 ? ['a'] : ['b'],
  summary: 'hello',
  headerImage: 'https://example.com/sample.png',
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
);

describe('BlogsClient', () => {
  it('renders headings and first items', async () => {
    const { render } = await import('@testing-library/react');
    const { getAllByText } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });
    expect(getAllByText('✨ Latest').length).toBeGreaterThan(0);
    expect(getAllByText('🗂 All Posts').length).toBeGreaterThan(0);
    expect(getAllByText('Sample 0').length).toBeGreaterThan(0);
  });
  it('filters by search query and shows result summary with removable chips', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    const { waitFor } = await import('@testing-library/react');
    const { getByPlaceholderText, getByTestId, getByRole, queryByRole, queryByText } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });
    const input = getByPlaceholderText('Search...') as HTMLInputElement;
    const user = userEvent.default.setup();
    await user.type(input, 'zzzz');
    await waitFor(() => {
      expect(getByTestId('filter-result-summary')).toHaveTextContent('0 of 12 items');
      expect(queryByText('Sample 0')).toBeNull();
    });
    expect(screen.getByTestId('filter-empty-state')).toHaveTextContent('No items found');
    expect(getByRole('button', { name: 'Clear Search' })).toBeInTheDocument();

    const chip = getByRole('button', { name: 'Remove Search: zzzz' });
    expect(chip).toHaveTextContent('Search: zzzz');

    await user.click(chip);
    expect(input).toHaveValue('');
    expect(getByTestId('filter-result-summary')).toHaveTextContent('12 items');
    expect(queryByRole('button', { name: 'Remove Search: zzzz' })).toBeNull();
  });
  it('highlights matching query fragments in blog text', async () => {
    const { render, screen, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    await user.type(screen.getByRole('textbox', { name: 'Search...' }), 'hello');

    await waitFor(() => {
      expect(screen.getAllByText('hello', { selector: 'mark.search-highlight' }).length).toBeGreaterThan(0);
    });
  });
  it('applies tag filter from query params', async () => {
    const { render } = await import('@testing-library/react');
    const { getAllByText, queryByText } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: ({ children }) => <NuqsTestingAdapter searchParams="?tags=a">{children}</NuqsTestingAdapter>,
    });
    expect(getAllByText('Sample 0').length).toBeGreaterThan(0);
    expect(queryByText('Sample 1')).toBeNull();
  });
  it('supports selecting multiple years from the year filter', async () => {
    const { render, screen } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    const yearSummary = screen.getByText('Year').closest('summary');
    if (!yearSummary) throw new Error('Year filter summary is missing');

    await user.click(yearSummary);
    const year2025 = screen.getByRole('button', { name: '2025' });
    const year2024 = screen.getByRole('button', { name: '2024' });
    await user.click(year2025);
    await user.click(year2024);

    expect(year2025).toHaveAttribute('aria-pressed', 'true');
    expect(year2024).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('filter-result-summary')).toHaveTextContent('12 items');
  });
  it('hides preview images on mobile to reduce initial downloads', async () => {
    const { render } = await import('@testing-library/react');
    const { container } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });
    const wrappers = container.querySelectorAll('[data-testid="blog-image"]');
    expect(wrappers.length).toBeGreaterThan(0);
    wrappers.forEach((el) => {
      expect(el.className).toContain('hidden');
      expect(el.className).toContain('sm:block');
    });
  });

  it('reveals blog lists after the initial enter delay', async () => {
    vi.useFakeTimers();
    const { render } = await import('@testing-library/react');

    render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });

    expect(screen.getByTestId('blog-latest-list')).toHaveAttribute('data-state', 'hidden');
    expect(screen.getByTestId('blog-all-list')).toHaveAttribute('data-state', 'hidden');

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(screen.getByTestId('blog-latest-list')).toHaveAttribute('data-state', 'open');
    expect(screen.getByTestId('blog-all-list')).toHaveAttribute('data-state', 'open');
    vi.useRealTimers();
  });

  it('adds linked-card classes so title hover can affect the whole card', async () => {
    const { render } = await import('@testing-library/react');

    render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });

    const latestCard = screen.getAllByTestId('blog-latest-card')[0];
    const latestTitleLink = latestCard.querySelector('a[href*="/blogs/"]');
    const latestMedia = latestCard.querySelector('.blog-linked-card__media');

    expect(latestCard).toHaveClass('blog-linked-card');
    expect(latestTitleLink).toHaveClass('blog-linked-card__title-link');
    expect(latestMedia).toBeTruthy();

    const allCard = screen.getAllByTestId('blog-card')[0];
    const allTitleLink = allCard.querySelector('a[href*="/blogs/"]');
    expect(allCard).toHaveClass('blog-linked-card');
    expect(allTitleLink).toHaveClass('blog-linked-card__title-link');
  });
});
