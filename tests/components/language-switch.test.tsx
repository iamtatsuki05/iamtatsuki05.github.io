import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

function setPathname(pathname: string) {
  (globalThis as any).__NEXT_TEST_PATHNAME__ = pathname;
}

afterEach(() => {
  window.localStorage.clear();
  setPathname('/');
});

describe('LanguageSwitch', () => {
  it('translatable pathでは言語リンクを表示する', () => {
    setPathname('/en-US/links/');
    render(<LanguageSwitch />);

    const jaLink = screen.getByRole('link', { name: 'JA' });
    const enLink = screen.getByRole('link', { name: 'EN' });
    const indicator = screen.getByTestId('language-switch-indicator');
    const group = screen.getByRole('group', { name: 'Language switch' });

    expect(jaLink.getAttribute('href')).toBe('/ja-JP/links/');
    expect(enLink.getAttribute('href')).toBe('/en-US/links/');
    expect(enLink.getAttribute('aria-current')).toBe('true');
    expect(jaLink.getAttribute('aria-current')).toBeNull();
    expect(indicator.getAttribute('data-active-locale')).toBe('en');
    expect(group.className).toContain('language-switch-shell');
    expect(enLink.className).toContain('language-switch-option');
  });

  it('locale付きパスでは選択中言語を保存する', async () => {
    setPathname('/en-US/links/');
    render(<LanguageSwitch />);

    await waitFor(() => expect(window.localStorage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)).toBe('en'));
  });

  it('hobbies でも言語リンクを切り替えられる', () => {
    setPathname('/en-US/hobbies/');
    render(<LanguageSwitch />);

    expect(screen.getByRole('link', { name: 'JA' }).getAttribute('href')).toBe('/ja-JP/hobbies/');
    expect(screen.getByRole('link', { name: 'EN' }).getAttribute('href')).toBe('/en-US/hobbies/');
  });

  it('非対応ページではリンクではなく固定表示になる', () => {
    setPathname('/ja-JP/blogs/example-post/');
    render(<LanguageSwitch />);

    expect(screen.queryByRole('link', { name: 'JA' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'EN' })).toBeNull();
    expect(screen.getByRole('group', { name: 'Language switch' }).getAttribute('aria-disabled')).toBe('true');
    expect(screen.getByText('JA').getAttribute('aria-current')).toBe('true');
    expect(screen.getByTestId('language-switch-indicator').getAttribute('data-active-locale')).toBe('ja');
  });
});
