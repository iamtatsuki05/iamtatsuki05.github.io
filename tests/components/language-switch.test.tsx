
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitch } from '@/components/site/LanguageSwitch';

describe('LanguageSwitch', () => {
  it('translatable pathでは言語リンクを表示する', () => {
    render(<LanguageSwitch currentPath="/en-US/links/" />);

    const jaLink = screen.getByRole('link', { name: 'JA' });
    const enLink = screen.getByRole('link', { name: 'EN' });
    const zhLink = screen.getByRole('link', { name: 'ZH' });
    const frLink = screen.getByRole('link', { name: 'FR' });
    const indicator = screen.getByTestId('language-switch-indicator');
    const group = screen.getByRole('group', { name: 'Language switch' });

    expect(jaLink.getAttribute('href')).toBe('/ja-JP/links/');
    expect(enLink.getAttribute('href')).toBe('/en-US/links/');
    expect(zhLink.getAttribute('href')).toBe('/zh-CN/links/');
    expect(frLink.getAttribute('href')).toBe('/fr-FR/links/');
    expect(enLink.getAttribute('aria-current')).toBe('true');
    expect(jaLink.getAttribute('aria-current')).toBeNull();
    expect(indicator.getAttribute('data-active-locale')).toBe('en');
    expect(group.className).toContain('language-switch-shell');
    expect(enLink.className).toContain('language-switch-option');
  });

  it('hobbies でも言語リンクを切り替えられる', () => {
    render(<LanguageSwitch currentPath="/en-US/hobbies/" />);

    expect(screen.getByRole('link', { name: 'JA' }).getAttribute('href')).toBe('/ja-JP/hobbies/');
    expect(screen.getByRole('link', { name: 'EN' }).getAttribute('href')).toBe('/en-US/hobbies/');
    expect(screen.getByRole('link', { name: 'ZH' }).getAttribute('href')).toBe('/zh-CN/hobbies/');
    expect(screen.getByRole('link', { name: 'FR' }).getAttribute('href')).toBe('/fr-FR/hobbies/');
  });

  it('blog detail でも言語リンクを切り替えられる', () => {
    render(<LanguageSwitch currentPath="/ja-JP/blogs/example-post/" />);

    expect(screen.getByRole('link', { name: 'JA' }).getAttribute('href')).toBe('/ja-JP/blogs/example-post/');
    expect(screen.getByRole('link', { name: 'EN' }).getAttribute('href')).toBe('/en-US/blogs/example-post/');
    expect(screen.getByRole('link', { name: 'ZH' }).getAttribute('href')).toBe('/zh-CN/blogs/example-post/');
    expect(screen.getByRole('link', { name: 'FR' }).getAttribute('href')).toBe('/fr-FR/blogs/example-post/');
    expect(screen.getByTestId('language-switch-indicator').getAttribute('data-active-locale')).toBe('ja');
  });
});
