import { act, fireEvent, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/site/Header';
import { initHeader } from '@/components/site/headerController';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

const STILL = 'translate3d(0, 0px, 0) scaleX(1.000) scaleY(1.000) rotate(0deg)';

function mockMatchMedia(active: string[] = []) {
  const listeners = new Map<string, () => void>();
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: active.includes(query),
    media: query,
    addEventListener: (_: string, listener: () => void) => listeners.set(query, listener),
    removeEventListener: () => listeners.delete(query),
  }));
  return listeners;
}

/** Mirrors production: Astro serializes the static Header to HTML, then the module script runs. */
function mountHeader(currentPath = '/ja-JP/') {
  document.body.innerHTML = renderToStaticMarkup(<Header currentPath={currentPath} />);
  initHeader();
}

beforeEach(() => {
  document.documentElement.className = '';
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = '';
  document.body.style.overflow = '';
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
});

describe('Header markup', () => {
  it('shows the decorative personal icon next to the site title', () => {
    mockMatchMedia();
    mountHeader();

    const title = screen.getByRole('link', { name: /^Tatsuki Okada$/ });
    const icon = screen.getByTestId('header-personal-icon');
    expect(title).toContainElement(icon);
    expect(icon).toHaveAttribute('src', '/header-icon-56.webp');
    expect(icon).toHaveAttribute('alt', '');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(title.className).toContain('min-w-0');
    expect(title.className).toContain('truncate');
  });

  it('does not render the mobile menu until it is opened', () => {
    mockMatchMedia();
    mountHeader();
    expect(document.getElementById('mobile-menu')).toBeNull();
  });
});

describe('Header icon motion', () => {
  it('gets pressed into a stronger squash reaction with page scroll', () => {
    mockMatchMedia();
    mountHeader();

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    window.dispatchEvent(new Event('scroll'));

    expect(screen.getByTestId('header-personal-icon')).toHaveStyle({
      transform: 'translate3d(0, 3px, 0) scaleX(1.240) scaleY(0.760) rotate(-3deg)',
      transformOrigin: '50% 85%',
    });
  });

  it('keeps the icon still when reduced motion is requested', () => {
    mockMatchMedia(['(prefers-reduced-motion: reduce)']);
    mountHeader();

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    window.dispatchEvent(new Event('scroll'));

    expect(screen.getByTestId('header-personal-icon')).toHaveStyle({ transform: STILL, transformOrigin: '50% 85%' });
  });
});

describe('Header theme toggle', () => {
  it('follows a dark system theme and switches to light on click', () => {
    mockMatchMedia(['(prefers-color-scheme: dark)']);
    mountHeader();

    const [toggle] = screen.getAllByRole('button', { name: 'Toggle theme' });
    expect(toggle).toHaveAttribute('data-theme', 'dark');
    expect(toggle).toHaveAttribute('data-next-theme', 'light');
    expect(toggle.className).toContain('theme-toggle');

    fireEvent.click(toggle);
    expect(document.documentElement).toHaveClass('light');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(window.localStorage.getItem('theme')).toBe('light');
    for (const button of screen.getAllByRole('button', { name: 'Toggle theme' })) {
      expect(button).toHaveAttribute('data-theme', 'light');
      expect(button).toHaveAttribute('data-next-theme', 'dark');
    }
  });

  it('prefers the stored theme over the system theme', () => {
    mockMatchMedia(['(prefers-color-scheme: dark)']);
    window.localStorage.setItem('theme', 'light');
    mountHeader();

    expect(document.documentElement).toHaveClass('light');
    expect(screen.getAllByRole('button', { name: 'Toggle theme' })[0]).toHaveAttribute('data-next-theme', 'dark');
  });

  it('tracks system theme changes only while no theme is stored', () => {
    const listeners = mockMatchMedia();
    mountHeader();
    expect(document.documentElement).toHaveClass('light');

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    listeners.get('(prefers-color-scheme: dark)')?.();
    expect(document.documentElement).toHaveClass('dark');
  });
});

describe('Header language switch', () => {
  it('links every locale for the current page and marks the current one', () => {
    mockMatchMedia();
    mountHeader('/en-US/links/');

    const [group] = screen.getAllByRole('group', { name: 'Language switch' });
    const link = (name: string) => within(group).getByRole('link', { name });
    expect(link('JA').getAttribute('href')).toBe('/ja-JP/links/');
    expect(link('EN').getAttribute('href')).toBe('/en-US/links/');
    expect(link('ZH').getAttribute('href')).toBe('/zh-CN/links/');
    expect(link('FR').getAttribute('href')).toBe('/fr-FR/links/');
    expect(link('EN').getAttribute('aria-current')).toBe('true');
    expect(link('JA').getAttribute('aria-current')).toBeNull();
    expect(group.className).toContain('language-switch-shell');
    expect(link('EN').className).toContain('language-switch-option');
  });

  it('shows the indicator pill on the current locale and colors it only then', () => {
    mockMatchMedia();
    mountHeader('/ja-JP/blogs/example-post/');

    const [indicator] = screen.getAllByTestId('language-switch-indicator');
    expect(indicator.getAttribute('data-active-locale')).toBe('ja');
    expect(indicator.style.opacity).toBe('1');
    expect(screen.getAllByRole('link', { name: 'JA' })[0].className).toContain('text-[#2a143f]!');
    expect(screen.getAllByRole('link', { name: 'EN' })[0].getAttribute('href')).toBe('/en-US/blogs/example-post/');
  });

  it('remembers the locale of a localized path', () => {
    mockMatchMedia();
    mountHeader('/en-US/hobbies/');
    expect(window.localStorage.getItem(LOCALE_PREFERENCE_STORAGE_KEY)).toBe('en');
  });
});

describe('Header mobile menu', () => {
  function openMenu() {
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    return document.getElementById('mobile-menu') as HTMLElement;
  }

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('opens from the closed state, animates to open, and locks body scroll', () => {
    mockMatchMedia();
    mountHeader();

    const menu = openMenu();
    expect(menu.parentElement).toBe(document.body);
    expect(menu).toHaveAttribute('data-state', 'closed');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'true');

    act(() => vi.advanceTimersByTime(16));
    expect(menu).toHaveAttribute('data-state', 'open');
    expect(menu.querySelector('.mobile-menu-panel')).toHaveAttribute('data-state', 'open');
    expect(document.body.style.overflow).toBe('hidden');
    expect(menu.querySelectorAll('nav a')).toHaveLength(6);
  });

  it('closes with the close button and unmounts after the animation', () => {
    mockMatchMedia();
    mountHeader();
    const menu = openMenu();
    act(() => vi.advanceTimersByTime(16));

    fireEvent.click(screen.getByRole('button', { name: 'Close menu', hidden: true }));
    expect(menu).toHaveAttribute('data-state', 'closed');
    act(() => vi.advanceTimersByTime(279));
    expect(document.getElementById('mobile-menu')).not.toBeNull();
    act(() => vi.advanceTimersByTime(1));
    expect(document.getElementById('mobile-menu')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape, on an overlay click, and one tick after a link click, but not on a panel click', () => {
    mockMatchMedia();
    mountHeader();

    let menu = openMenu();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(menu).toHaveAttribute('aria-hidden', 'true');
    act(() => vi.advanceTimersByTime(280));

    menu = openMenu();
    fireEvent.click(menu.querySelector('.mobile-menu-panel') as HTMLElement);
    expect(menu).toHaveAttribute('aria-hidden', 'false');
    fireEvent.click(menu);
    expect(menu).toHaveAttribute('aria-hidden', 'true');
    act(() => vi.advanceTimersByTime(280));

    menu = openMenu();
    fireEvent.click(menu.querySelector('nav a') as HTMLElement);
    expect(menu).toHaveAttribute('aria-hidden', 'false');
    act(() => vi.advanceTimersByTime(0));
    expect(menu).toHaveAttribute('aria-hidden', 'true');
  });

  it('closes immediately when the viewport is already desktop width', () => {
    mockMatchMedia(['(min-width: 1280px)', '(prefers-reduced-motion: reduce)']);
    mountHeader();
    openMenu();
    expect(document.getElementById('mobile-menu')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
});
