import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.doMock('next/navigation', () => ({ usePathname: () => '/' }));
});

describe('Footer locale-aware links', () => {
  it('uses en prefix when pathname is /en-US/blogs/', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/en-US/blogs/' }));
    const { Footer } = await import('@/components/site/Footer');
    const { render } = await import('@testing-library/react');
    const { getByText } = render(<Footer />);
    expect(getByText(/Blog/).getAttribute('href')).toBe('/en-US/blogs/');
  });

  it('uses ja prefix by default', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/blogs/' }));
    const { Footer } = await import('@/components/site/Footer');
    const { render } = await import('@testing-library/react');
    const { getByText } = render(<Footer />);
    expect(getByText(/Links/).getAttribute('href')).toBe('/ja-JP/links/');
  });
});
