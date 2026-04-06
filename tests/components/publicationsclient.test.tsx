import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
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
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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
    const typeDisclosure = Array.from(container.querySelectorAll('details[data-filter-disclosure="true"]')).find((node) =>
      node.textContent?.includes('Types'),
    );
    const typeSummary = typeDisclosure?.querySelector('summary');
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

    const typeDisclosure = Array.from(container.querySelectorAll('details[data-filter-disclosure="true"]')).find((node) =>
      node.textContent?.includes('Types'),
    );
    const tagDisclosure = Array.from(container.querySelectorAll('details[data-filter-disclosure="true"]')).find((node) =>
      node.textContent?.includes('Tags'),
    );
    const typeSummary = typeDisclosure?.querySelector('summary');
    const tagSummary = tagDisclosure?.querySelector('summary');
    if (!typeSummary || !tagSummary || !typeDisclosure || !tagDisclosure) {
      throw new Error('Filter disclosures are missing');
    }

    const user = userEvent.default.setup();
    await user.click(typeSummary);
    expect(typeDisclosure).toHaveAttribute('open');
    expect(tagDisclosure).not.toHaveAttribute('open');

    await user.click(tagSummary);
    expect(tagDisclosure).toHaveAttribute('open');
    expect(typeDisclosure).not.toHaveAttribute('open');
  });

  it('closes the tag disclosure after choosing a tag on mobile', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(max-width: 639px)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    const { container } = render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    const tagDisclosure = Array.from(container.querySelectorAll('details[data-filter-disclosure="true"]')).find((node) =>
      node.textContent?.includes('Tags'),
    );
    const tagSummary = tagDisclosure?.querySelector('summary');
    if (!tagSummary || !tagDisclosure) throw new Error('Tag filter is missing');

    const user = userEvent.default.setup();
    await user.click(tagSummary);
    expect(tagDisclosure).toHaveAttribute('open');

    await user.click(tagDisclosure.querySelector('button[aria-label="Filter by llm tag"]') as HTMLButtonElement);
    expect(tagDisclosure).not.toHaveAttribute('open');
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

  it('shows result summary and removable chips for active filters', async () => {
    const { render, screen, within } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    expect(screen.getByTestId('filter-result-summary')).toHaveTextContent('2 items');

    const user = userEvent.default.setup();
    const tagDisclosure = Array.from(document.querySelectorAll('details[data-filter-disclosure="true"]')).find((node) =>
      node.textContent?.includes('Tags'),
    );
    const tagSummary = tagDisclosure?.querySelector('summary');
    if (!tagSummary || !tagDisclosure) throw new Error('Tag filter is missing');

    await user.click(tagSummary);
    const tagFilter = within(tagDisclosure);
    await user.click(tagFilter.getByRole('button', { name: 'Filter by llm tag' }));

    expect(tagSummary).toHaveTextContent('(1)');
    expect(screen.getByTestId('filter-result-summary')).toHaveTextContent('1 of 2 items');

    const chip = screen.getByRole('button', { name: 'Remove #llm' });
    expect(chip).toHaveTextContent('#llm');

    await user.click(chip);
    expect(screen.getByTestId('filter-result-summary')).toHaveTextContent('2 items');
  });

  it('offers quick recovery actions when no publication results remain', async () => {
    const { render, screen, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    const input = screen.getByRole('textbox', { name: 'Search...' });
    await user.type(input, 'zzzz');

    await waitFor(() => {
      expect(screen.getByTestId('filter-empty-state')).toHaveTextContent('No items found for "zzzz"');
    });

    const clearSearch = screen.getByRole('button', { name: 'Clear Search' });
    await user.click(clearSearch);

    expect(input).toHaveValue('');
    expect(screen.queryByTestId('filter-empty-state')).toBeNull();
  });

  it('highlights matching publication metadata fragments', async () => {
    const { render, screen, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    render(<PublicationsClient items={items} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    await user.type(screen.getByRole('textbox', { name: 'Search...' }), 'conf');

    await waitFor(() => {
      expect(screen.getByText('Conf', { selector: 'mark.search-highlight' })).toBeInTheDocument();
    });
  });

  it('prefers newer publications when search relevance ties', async () => {
    const { render, screen, waitFor, within } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    const publicationItems = [
      {
        slug: 'older-paper',
        title: 'Older paper',
        type: 'paper' as const,
        tags: ['llm'],
        publishedAt: '2024-01-01',
        venue: 'Conf',
        links: [{ kind: 'pdf', url: 'https://example.com/older.pdf' }],
      },
      {
        slug: 'newer-paper',
        title: 'Newer paper',
        type: 'paper' as const,
        tags: ['llm'],
        publishedAt: '2025-01-01',
        venue: 'Conf',
        links: [{ kind: 'pdf', url: 'https://example.com/newer.pdf' }],
      },
    ];

    render(<PublicationsClient items={publicationItems} locale="en" />, {
      wrapper: Wrapper,
    });

    const user = userEvent.default.setup();
    await user.type(screen.getByRole('textbox', { name: 'Search...' }), 'conf');

    await waitFor(() => {
      const cards = screen.getAllByTestId('publication-card');
      expect(within(cards[0]).getByText('Newer paper')).toBeInTheDocument();
      expect(within(cards[1]).getByText('Older paper')).toBeInTheDocument();
    });
  });

  it('shows publication sort controls while searching and lets the user switch them', async () => {
    const { render, screen, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    const publicationItems = [
      {
        slug: 'older-exact',
        title: 'Encoder',
        type: 'paper' as const,
        tags: ['llm'],
        publishedAt: '2024-01-01',
        venue: 'Notes',
        links: [{ kind: 'pdf', url: 'https://example.com/older.pdf' }],
      },
      {
        slug: 'newer-secondary',
        title: 'System design notes',
        type: 'paper' as const,
        tags: ['encoder'],
        publishedAt: '2025-01-01',
        venue: 'Notes',
        links: [{ kind: 'pdf', url: 'https://example.com/newer.pdf' }],
      },
    ];

    render(<PublicationsClient items={publicationItems} locale="en" />, {
      wrapper: ({ children }) => <NuqsTestingAdapter searchParams="?q=encoder">{children}</NuqsTestingAdapter>,
    });

    const user = userEvent.default.setup();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Relevant' })).toHaveAttribute('aria-pressed', 'true');
    });

    await user.click(screen.getByRole('button', { name: 'Newest' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Newest' })).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
