import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkGrid } from '@/components/links/LinkGrid';

const items = [
  { title: 'GitHub', url: 'https://github.com', desc: 'Code hosting' },
  { title: 'Blog', url: 'https://example.com/blog', desc: 'Posts' },
];

describe('LinkGrid', () => {
  it('renders links without client-side reveal state', () => {
    const { container } = render(<LinkGrid items={items} showDescription iconSize={40} />);

    const githubLinks = screen.getAllByRole('link', { name: 'GitHub' });
    expect(githubLinks).toHaveLength(1);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com');
    expect(githubLinks[0]).toHaveAttribute('aria-describedby', 'link-grid-0-description');
    expect(screen.getByText('GH')).toBeInTheDocument();
    expect(screen.getByText('Code hosting')).toBeVisible();

    const list = container.querySelector('ul.content-reveal-list');
    if (!list) throw new Error('Link grid list is missing');

    expect(list).toHaveAttribute('data-state', 'open');
    expect(list).not.toHaveAttribute('data-client-reveal');
  });

  it('renders fetched official social assets as local images', () => {
    const officialItems = [
      { title: 'GitHub', url: 'https://github.com', iconUrl: '/images/links/github.svg' },
      { title: 'X (Twitter)', url: 'https://x.com', iconUrl: '/images/links/x.svg' },
      { title: 'Instagram', url: 'https://instagram.com', iconUrl: '/images/links/instagram.webp' },
      { title: 'LinkedIn', url: 'https://linkedin.com', iconUrl: '/images/links/linkedin.ico' },
      { title: 'Huggingface', url: 'https://huggingface.co/iamtatsuki05', iconUrl: '/images/links/huggingface.svg' },
    ];

    const { container } = render(
      <LinkGrid
        items={officialItems}
        iconSize={40}
      />,
    );

    expect(container.querySelector('svg')).not.toBeInTheDocument();
    for (const item of officialItems) {
      expect(screen.getByAltText(item.title)).toHaveAttribute('src', item.iconUrl);
    }
  });

  it('keeps the fallback label when an unknown external icon fails to load', () => {
    render(
      <LinkGrid
        items={[
          {
            title: 'Docs',
            url: 'https://example.com/docs',
            iconUrl: 'https://example.com/icon.svg',
          },
        ]}
        iconSize={40}
      />,
    );

    const icon = screen.getByAltText('Docs');
    fireEvent.error(icon);

    expect(screen.queryByAltText('Docs')).not.toBeInTheDocument();
    expect(screen.getByText('DO')).toBeInTheDocument();
  });
});
