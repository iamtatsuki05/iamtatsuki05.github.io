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

  it('builds type filter options from publication metadata', async () => {
    const { render } = await import('@testing-library/react');
    const { within } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    const { container, getByText, getAllByRole, queryByText } = render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    const typeSummary = container.querySelectorAll('summary')[0];
    if (!typeSummary) throw new Error('Type filter summary is missing');
    await user.click(typeSummary);
    const typeDetails = typeSummary.closest('details');
    if (!typeDetails) throw new Error('Type filter details is missing');
    const typeFilter = within(typeDetails);

    expect(getAllByRole('checkbox')).toHaveLength(2);
    expect(typeFilter.getByText('📄 Papers')).toBeInTheDocument();
    expect(typeFilter.getByText('📝 Technical Articles')).toBeInTheDocument();
    expect(queryByText('🎤 Talks')).toBeNull();
  });

  it('keeps only one filter disclosure open at a time', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');
    const { container } = render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    const summaries = container.querySelectorAll('summary');
    const disclosures = container.querySelectorAll('details[data-filter-disclosure="true"]');
    if (summaries.length < 2 || disclosures.length < 2) throw new Error('Filter disclosures are missing');

    const user = userEvent.default.setup();
    await user.click(summaries[0]);
    expect(disclosures[0]).toHaveAttribute('open');
    expect(disclosures[1]).not.toHaveAttribute('open');

    await user.click(summaries[1]);
    expect(disclosures[1]).toHaveAttribute('open');
    expect(disclosures[0]).not.toHaveAttribute('open');
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
