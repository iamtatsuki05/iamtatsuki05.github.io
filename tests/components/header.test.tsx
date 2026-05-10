import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/site/Header';

function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
});

describe('Header', () => {
  it('shows the decorative personal icon next to the site title', () => {
    mockReducedMotion(false);

    render(<Header />);

    const title = screen.getByRole('link', { name: /Tatsuki Okada - Personal Site/ });
    const icon = screen.getByTestId('header-personal-icon');

    expect(title).toContainElement(icon);
    expect(icon).toHaveAttribute('src', '/icon-192x192.png');
    expect(icon).toHaveAttribute('alt', '');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('rotates the personal icon with page scroll', () => {
    mockReducedMotion(false);
    render(<Header />);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('header-personal-icon')).toHaveStyle({ transform: 'rotate(84deg)' });
  });

  it('does not rotate the icon when reduced motion is requested', () => {
    mockReducedMotion(true);
    render(<Header />);

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 240 });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(screen.getByTestId('header-personal-icon')).toHaveStyle({ transform: 'rotate(0deg)' });
  });

  it('keeps the title area shrinkable on mobile so controls do not overlap', () => {
    mockReducedMotion(false);
    render(<Header />);

    const title = screen.getByRole('link', { name: /Tatsuki Okada - Personal Site/ });

    expect(title.className).toContain('min-w-0');
    expect(title.className).toContain('truncate');
  });
});
