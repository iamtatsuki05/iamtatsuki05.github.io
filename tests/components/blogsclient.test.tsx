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
  it('filters by search query', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    const { getByPlaceholderText, findAllByText } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });
    const input = getByPlaceholderText('Search...') as HTMLInputElement;
    const user = userEvent.default.setup();
    await user.type(input, 'Sample 11');
    const results = await findAllByText('Sample 11');
    expect(results.length).toBeGreaterThan(0);
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
    const { getAllByText } = render(<BlogsClient posts={sample} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    const yearSummary = screen.getByText('Year').closest('summary');
    if (!yearSummary) throw new Error('Year filter summary is missing');

    await user.click(yearSummary);
    await user.click(screen.getByRole('button', { name: '2025' }));
    await user.click(screen.getByRole('button', { name: '2024' }));

    expect(getAllByText('Sample 0').length).toBeGreaterThan(0);
    expect(getAllByText('Sample 1').length).toBeGreaterThan(0);
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
});
