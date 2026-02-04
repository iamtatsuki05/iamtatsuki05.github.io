import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogToc } from '@/components/blogs/BlogToc';

function createRect(top: number, height: number = 40): DOMRect {
  return {
    x: 0,
    y: top,
    width: 100,
    height,
    top,
    left: 0,
    right: 100,
    bottom: top + height,
    toJSON() {
      return {};
    },
  } as DOMRect;
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  });
  Object.defineProperty(window, 'pageYOffset', {
    value,
    writable: true,
    configurable: true,
  });
}

describe('BlogToc', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <article id="blog-article">
        <h2 id="sec-1">セクション1</h2>
        <p>text</p>
        <h3 id="sub-1">サブ1</h3>
        <h2 id="sec-2">セクション2</h2>
      </article>
    `;
    setScrollY(0);

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      return window.setTimeout(() => cb(0), 0) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      clearTimeout(id);
    });

    const article = document.getElementById('blog-article');
    if (!article) return;

    Object.defineProperty(article, 'offsetHeight', {
      value: 2000,
      configurable: true,
    });
    article.getBoundingClientRect = vi.fn(() => createRect(-window.scrollY, 2000));

    const sec1 = document.getElementById('sec-1');
    const sub1 = document.getElementById('sub-1');
    const sec2 = document.getElementById('sec-2');

    if (sec1) sec1.getBoundingClientRect = vi.fn(() => createRect(120, 48));
    if (sub1) sub1.getBoundingClientRect = vi.fn(() => createRect(720, 48));
    if (sec2) sec2.getBoundingClientRect = vi.fn(() => createRect(1250, 48));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders toc items from headings and sets item count style', async () => {
    render(<BlogToc containerId="blog-article" />);

    const toc = await screen.findByTestId('blog-toc');
    expect(within(toc).getByRole('link', { name: 'セクション1' })).toBeInTheDocument();
    expect(within(toc).getByRole('link', { name: 'サブ1' })).toBeInTheDocument();
    expect(within(toc).getByRole('link', { name: 'セクション2' })).toBeInTheDocument();
    expect(toc).toHaveStyle('--toc-item-count: 3');
    expect(within(toc).getByTestId('blog-toc-progress')).toHaveClass('motion-reduce:transition-none');
  });

  it('updates active heading and reading progress while scrolling', async () => {
    render(<BlogToc containerId="blog-article" />);
    const toc = await screen.findByTestId('blog-toc');

    await waitFor(() => {
      expect(within(toc).getByRole('link', { name: 'セクション1' })).toHaveAttribute('aria-current', 'true');
    });

    setScrollY(1200);
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(within(toc).getByRole('link', { name: 'セクション2' })).toHaveAttribute('aria-current', 'true');
    });

    const progress = within(toc).getByTestId('blog-toc-progress');
    await waitFor(() => {
      expect(Number.parseInt((progress as HTMLElement).style.width, 10)).toBeGreaterThan(40);
    });
  });

  it('returns null when headings do not exist', () => {
    document.body.innerHTML = '<article id="blog-article"><p>本文のみ</p></article>';
    render(<BlogToc containerId="blog-article" />);
    expect(screen.queryByTestId('blog-toc')).not.toBeInTheDocument();
  });

  it('toggles floating toc panel with fab on medium viewport', async () => {
    const user = userEvent.setup();
    render(<BlogToc containerId="blog-article" />);

    const fab = screen.getByTestId('blog-toc-fab');
    expect(fab).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByTestId('blog-toc-sheet')).not.toBeInTheDocument();

    await user.click(fab);
    expect(fab).toHaveAttribute('aria-expanded', 'true');
    const sheet = screen.getByTestId('blog-toc-sheet');
    expect(within(sheet).getByRole('link', { name: 'セクション1' })).toBeInTheDocument();

    await user.click(within(sheet).getByRole('button', { name: '閉じる' }));
    await waitFor(() => {
      expect(screen.queryByTestId('blog-toc-sheet')).not.toBeInTheDocument();
    });
  });
});
