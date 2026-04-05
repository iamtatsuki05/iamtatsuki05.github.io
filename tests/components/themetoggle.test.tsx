import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeToggle } from '@/components/site/ThemeToggle';

const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockUseTheme.mockReset();
  });

  it('システムがダークモードのとき、月アイコンを表示してライトモードへ切り替える', async () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolvedTheme: 'dark',
      setTheme,
    });

    render(<ThemeToggle />);

    const toggle = await screen.findByRole('button', { name: 'Toggle theme' });
    expect(toggle).toHaveAttribute('data-theme', 'dark');
    expect(toggle).toHaveAttribute('data-next-theme', 'light');

    fireEvent.click(toggle);
    expect(setTheme).toHaveBeenCalledWith('light');
  });

  it('システムがライトモードのとき、太陽アイコンを表示してダークモードへ切り替える', async () => {
    const setTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme,
    });

    render(<ThemeToggle />);

    const toggle = await screen.findByRole('button', { name: 'Toggle theme' });
    expect(toggle).toHaveAttribute('data-theme', 'light');
    expect(toggle).toHaveAttribute('data-next-theme', 'dark');

    fireEvent.click(toggle);
    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('resolvedThemeを取得できない間はプレースホルダを表示する', async () => {
    mockUseTheme.mockReturnValue({
      theme: 'system',
      resolvedTheme: undefined,
      setTheme: vi.fn(),
    });

    const { container } = render(<ThemeToggle />);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: 'Toggle theme' })).not.toBeInTheDocument();
    });
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });
});
