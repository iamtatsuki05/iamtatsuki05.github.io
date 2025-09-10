import React from 'react';
import { describe, it } from 'vitest';
import { BlogsClient } from '@/app/blogs/sections/BlogsClient';

const sample = Array.from({ length: 12 }).map((_, i) => ({
  slug: `post-${i}`,
  title: `Sample ${i}`,
  date: `2025-01-${(i + 1).toString().padStart(2, '0')}`,
  tags: i % 2 === 0 ? ['a'] : ['b'],
  summary: 'hello',
}));

describe('BlogsClient', () => {
  it('renders headings and first items', async () => {
    const { render } = await import('@testing-library/react');
    const { getByText, getAllByText } = render(<BlogsClient posts={sample} locale="en" />);
    expect(getByText('✨ Latest')).toBeInTheDocument();
    expect(getByText('🗂 All Posts')).toBeInTheDocument();
    expect(getAllByText('Sample 0').length).toBeGreaterThan(0);
  });
  it('filters by search query', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    const { getByPlaceholderText, findAllByText } = render(<BlogsClient posts={sample} locale="en" />);
    const input = getByPlaceholderText('Search...') as HTMLInputElement;
    const user = userEvent.default.setup();
    await user.type(input, 'Sample 11');
    const results = await findAllByText('Sample 11');
    expect(results.length).toBeGreaterThan(0);
  });
});
