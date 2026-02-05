import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.doMock('next/navigation', () => ({ usePathname: () => '/' }));
});

describe('LanguageSwitch', () => {
  it('translatable pathでは言語リンクを表示する', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/en-US/links/' }));
    const { LanguageSwitch } = await import('@/components/site/LanguageSwitch');
    const { render, screen } = await import('@testing-library/react');

    render(<LanguageSwitch />);

    const jaLink = screen.getByRole('link', { name: 'JA' });
    const enLink = screen.getByRole('link', { name: 'EN' });

    expect(jaLink.getAttribute('href')).toBe('/ja-JP/links/');
    expect(enLink.getAttribute('href')).toBe('/en-US/links/');
    expect(enLink.getAttribute('aria-current')).toBe('true');
    expect(jaLink.getAttribute('aria-current')).toBeNull();
  });

  it('非対応ページではリンクではなく固定表示になる', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/ja-JP/blogs/example-post/' }));
    const { LanguageSwitch } = await import('@/components/site/LanguageSwitch');
    const { render, screen } = await import('@testing-library/react');

    render(<LanguageSwitch />);

    expect(screen.queryByRole('link', { name: 'JA' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'EN' })).toBeNull();
    expect(screen.getByRole('group', { name: 'Language switch' }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('JA').getAttribute('aria-current')).toBe('true');
  });
});
