
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/site/Footer';

function setPathname(pathname: string) {
  (globalThis as any).__NEXT_TEST_PATHNAME__ = pathname;
}

afterEach(() => {
  setPathname('/');
});

describe('Footer locale-aware links', () => {
  it('uses en prefix when pathname is /en-US/blogs/', () => {
    setPathname('/en-US/blogs/');
    const { getByText } = render(<Footer />);
    expect(getByText(/Blogs/).getAttribute('href')).toBe('/en-US/blogs/');
  });

  it('uses ja prefix by default', () => {
    setPathname('/blogs/');
    render(<Footer />);
    expect(screen.getByText(/Links/).getAttribute('href')).toBe('/ja-JP/links/');
    expect(screen.getByText(/Hobbies/).getAttribute('href')).toBe('/ja-JP/hobbies/');
  });
});
