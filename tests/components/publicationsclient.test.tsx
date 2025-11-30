import React from 'react';
import { describe, it, expect } from 'vitest';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';
import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';

const items = [
  {
    slug: 'paper-1',
    title: 'Paper 1',
    type: 'paper' as const,
    tags: ['llm'],
    publishedAt: '2025-01-01',
    venue: 'Conf',
    links: [{ kind: 'pdf', url: 'https://example.com/paper.pdf' }],
    headerImage: 'https://example.com/paper.png',
  },
  {
    slug: 'article-1',
    title: 'Article 1',
    type: 'article' as const,
    tags: ['blog'],
    publishedAt: '2024-12-01',
    publisher: 'Example',
    links: [{ kind: 'post', url: 'https://example.com/post' }],
    headerImage: 'https://example.com/article.png',
  },
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <NuqsTestingAdapter>{children}</NuqsTestingAdapter>
);

describe('PublicationsClient', () => {
  it('renders grouped sections', async () => {
    const { render } = await import('@testing-library/react');
    const { getByRole, getByText } = render(<PublicationsClient items={items} locale="ja" />, {
      wrapper: Wrapper,
    });
    expect(getByRole('heading', { name: '📄 論文' })).toBeInTheDocument();
    expect(getByRole('heading', { name: '📝 技術ブログ' })).toBeInTheDocument();
    expect(getByText('Paper 1')).toBeInTheDocument();
  });

  it('hides preview images on mobile to reduce initial downloads', async () => {
    const { render } = await import('@testing-library/react');
    const { container } = render(<PublicationsClient items={items} locale="ja" />, {
      wrapper: Wrapper,
    });
    const wrappers = container.querySelectorAll('[data-testid="publication-image"]');
    expect(wrappers.length).toBeGreaterThan(0);
    wrappers.forEach((el) => {
      expect(el.className).toContain('hidden');
      expect(el.className).toContain('sm:block');
    });
  });
});
