import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkGrid } from '@/components/links/LinkGrid';

const items = [
  { title: 'GitHub', url: 'https://github.com', desc: 'Code hosting' },
  { title: 'Blog', url: 'https://example.com/blog', desc: 'Posts' },
];

describe('LinkGrid', () => {
  it('renders links without client-side reveal state', () => {
    const { container } = render(<LinkGrid items={items} showDescription iconSize={40} />);

    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com');
    expect(screen.getByText('Code hosting')).toBeVisible();

    const list = container.querySelector('ul.content-reveal-list');
    if (!list) throw new Error('Link grid list is missing');

    expect(list).toHaveAttribute('data-state', 'open');
    expect(list).not.toHaveAttribute('data-client-reveal');
  });
});
