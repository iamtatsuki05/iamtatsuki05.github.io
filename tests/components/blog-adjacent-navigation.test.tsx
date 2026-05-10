import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlogAdjacentNavigation } from '@/components/blogs/BlogAdjacentNavigation';
import { BlogAdjacentNavigationClient } from '@/components/blogs/BlogAdjacentNavigationClient';

const posts = [
  {
    slug: 'newest-ai',
    title: 'Newest AI',
    date: '2025-03-01',
    tags: ['ai'],
    summary: 'common search note',
  },
  {
    slug: 'middle-ai',
    title: 'Middle AI',
    date: '2025-02-01',
    tags: ['ai'],
    summary: 'common search note',
  },
  {
    slug: 'oldest-ai',
    title: 'Oldest AI',
    date: '2024-01-01',
    tags: ['ai'],
    summary: 'common search note',
  },
];

describe('BlogAdjacentNavigation', () => {
  beforeEach(() => {
    (globalThis as any).__NEXT_TEST_ROUTER_PUSH__ = vi.fn();
    (globalThis as any).__NEXT_TEST_SEARCH_PARAMS__ = '';
  });

  it('renders previous and next links with retained filter hrefs', () => {
    render(
      <BlogAdjacentNavigation
        previous={{ title: 'Previous post', href: '/blogs/previous/?q=ai' }}
        next={{ title: 'Next post', href: '/blogs/next/?q=ai' }}
      />,
    );

    expect(screen.getByRole('link', { name: '前の記事: Previous post' })).toHaveAttribute(
      'href',
      '/blogs/previous/?q=ai',
    );
    expect(screen.getByRole('link', { name: '次の記事: Next post' })).toHaveAttribute('href', '/blogs/next/?q=ai');
  });

  it('marks missing directions as disabled for assistive technology', () => {
    render(
      <BlogAdjacentNavigation
        previous={null}
        next={{ title: 'Next post', href: '/blogs/next/' }}
      />,
    );

    expect(screen.getByText('前の記事はありません')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: '次の記事: Next post' })).toBeInTheDocument();
  });

  it('uses a mobile swipe GUI instead of adjacent post boxes', () => {
    render(
      <BlogAdjacentNavigation
        previous={{ title: 'Previous post', href: '/blogs/previous/' }}
        next={{ title: 'Next post', href: '/blogs/next/' }}
      />,
    );

    const desktopLinks = screen.getByTestId('blog-adjacent-desktop-links');
    const mobileSwipeGui = screen.getByTestId('blog-adjacent-mobile-swipe');

    expect(desktopLinks.className).toContain('hidden');
    expect(desktopLinks.className).toContain('sm:grid');
    expect(mobileSwipeGui.className).toContain('sm:hidden');
    expect(mobileSwipeGui.className).not.toContain('border');
    expect(mobileSwipeGui.className).not.toContain('bg-white');
  });

  it('moves to the next post on a left swipe', () => {
    render(
      <BlogAdjacentNavigation
        previous={{ title: 'Previous post', href: '/blogs/previous/' }}
        next={{ title: 'Next post', href: '/blogs/next/?q=ai' }}
      />,
    );

    const nav = screen.getByRole('navigation', { name: '記事の前後ナビゲーション' });
    fireEvent.touchStart(nav, { touches: [{ clientX: 200, clientY: 20 }] });
    fireEvent.touchEnd(nav, { changedTouches: [{ clientX: 80, clientY: 28 }] });

    expect((globalThis as any).__NEXT_TEST_ROUTER_PUSH__).toHaveBeenCalledWith('/blogs/next/?q=ai');
  });

  it('does not navigate when swiping toward a missing direction', () => {
    render(
      <BlogAdjacentNavigation
        previous={null}
        next={{ title: 'Next post', href: '/blogs/next/' }}
      />,
    );

    const nav = screen.getByRole('navigation', { name: '記事の前後ナビゲーション' });
    fireEvent.touchStart(nav, { touches: [{ clientX: 80, clientY: 20 }] });
    fireEvent.touchEnd(nav, { changedTouches: [{ clientX: 200, clientY: 28 }] });

    expect((globalThis as any).__NEXT_TEST_ROUTER_PUSH__).not.toHaveBeenCalled();
  });

  it('reads URL filters on the client and keeps them in adjacent links', () => {
    (globalThis as any).__NEXT_TEST_SEARCH_PARAMS__ = '?q=common&year=2025&tags=ai&sort=newest';

    render(<BlogAdjacentNavigationClient posts={posts} currentSlug="middle-ai" />);

    expect(screen.getByRole('link', { name: '前の記事: Newest AI' })).toHaveAttribute(
      'href',
      '/blogs/newest-ai/?q=common&year=2025&tags=ai&sort=newest',
    );
    expect(screen.getByText('次の記事はありません')).toHaveAttribute('aria-disabled', 'true');
  });
});
